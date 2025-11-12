/// <reference types="cypress" />

describe('Ингредиенты загружаются из фикстуры', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients')
    cy.intercept('GET', '**/api/auth/user', { statusCode: 200, body: { success: true, user: null } }).as('getUser')
    cy.visit('/')
  })

  it('подменяет ответ и отображает данные фикстуры', () => {
    cy.wait('@getIngredients')
    cy.wait('@getIngredients')
    cy.contains('Краторная булка N-200i').scrollIntoView().should('be.visible')
    cy.contains('Биокотлета из марсианской Магнолии').scrollIntoView().should('be.visible')
  })

  it('добавляет одну начинку через «Добавить» и показывает её в конструкторе', () => {
    const fillingName = 'Биокотлета из марсианской Магнолии'

    cy.wait('@getIngredients')
    cy.wait('@getIngredients')

    cy.contains(fillingName)
      .closest('li, article, div')
      .within(() => {
        cy.contains('button', 'Добавить').scrollIntoView().click({ force: true })
      })

    cy.get('[data-cy="constructor"]', { timeout: 10000 })
      .scrollIntoView()
      .should('exist')
      .and('contain', 'Биокотлета из марсианской Магнолии')
  })

  it('открывает страницу ингредиента по клику и возвращается назад', () => {
    cy.contains('Биокотлета из марсианской Магнолии').click();

    cy.location('pathname', { timeout: 10000 })
      .should('match', /^\/ingredients\/[a-f0-9]+$/);

    cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');

    cy.go('back');

    cy.wait('@getIngredients');
    cy.wait('@getIngredients');

    cy.location('pathname').should('eq', '/');
    cy.get('[data-cy="constructor"]').should('exist');
  })

  it('оформляет заказ и очищает конструктор', () => {
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: { success: true, user: { name: 'Test', email: 'test@example.com' } }
    }).as('authUser')

    cy.intercept('POST', '**/api/orders', (req) => {
      const h = req.headers as Record<string, string | undefined>
      expect(h.authorization || h.Authorization).to.match(/^Bearer\s+/)
      req.reply({ statusCode: 200, body: { success: true, order: { number: 12345 } } })
    }).as('createOrder')

    cy.setCookie('accessToken', 'Bearer test-token')
    cy.window().then((w) => w.localStorage.setItem('refreshToken', 'test-refresh'))

    cy.visit('/')
    cy.wait('@getIngredients')
    cy.wait('@getIngredients')
    cy.wait('@authUser')

    cy.contains('Краторная булка N-200i')
      .closest('li, article, div')
      .within(() => cy.contains('button', 'Добавить').click({ force: true }))

    cy.contains('Биокотлета из марсианской Магнолии')
      .closest('li, article, div')
      .within(() => cy.contains('button', 'Добавить').click({ force: true }))

    cy.contains('button', 'Оформить заказ').click({ force: true })

    cy.wait('@createOrder')

    cy.url().should('eq', Cypress.config().baseUrl + '/');

    cy.contains('12345', { timeout: 10000 }).should('be.visible');

    cy.get('[data-cy="constructor"]', { timeout: 10000 }).within(() => {
      cy.contains(/Выберите булк/i, { timeout: 10000 }).should('be.visible');
      cy.contains(/Выберите начинк/i, { timeout: 10000 }).should('be.visible');
      cy.contains('Краторная булка N-200i').should('not.exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
    });
  })

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then(w => w.localStorage.removeItem('refreshToken'));
  });
})
