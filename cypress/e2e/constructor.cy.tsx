/// <reference types="cypress" />

const BUN_NAME = 'Краторная булка N-200i'
const FILLING_NAME = 'Биокотлета из марсианской Магнолии'
const CONSTRUCTOR_SELECTOR = '[data-cy="constructor"]'
const INGREDIENT_CONTAINER_SELECTOR = 'li, article, div'
const ADD_BUTTON_TEXT = 'Добавить'

describe('Ингредиенты загружаются из фикстуры', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients')

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: { success: true, user: null }
    }).as('getUser')

    cy.visit('/')
  })

  it('подменяет ответ и отображает данные фикстуры', () => {
    cy.wait('@getIngredients')
    cy.wait('@getIngredients')

    cy.contains(BUN_NAME).scrollIntoView().should('be.visible')
    cy.contains(FILLING_NAME).scrollIntoView().should('be.visible')
  })

  it('добавляет одну начинку через «Добавить» и показывает её в конструкторе', () => {
    cy.wait('@getIngredients')
    cy.wait('@getIngredients')

    cy.contains(FILLING_NAME)
      .closest(INGREDIENT_CONTAINER_SELECTOR)
      .as('fillingCard')

    cy.get('@fillingCard').within(() => {
      cy.contains('button', ADD_BUTTON_TEXT)
        .scrollIntoView()
        .click({ force: true })
    })

    cy.get(CONSTRUCTOR_SELECTOR, { timeout: 10000 })
      .as('constructor')

    cy.get('@constructor')
      .scrollIntoView()
      .should('exist')
      .and('contain', FILLING_NAME)
  })

  it('открывает страницу ингредиента по клику и возвращается назад', () => {
    cy.contains(FILLING_NAME).click()

    cy.location('pathname', { timeout: 10000 })
      .should('match', /^\/ingredients\/[a-f0-9]+$/)

    cy.contains(FILLING_NAME).should('be.visible')

    cy.go('back')

    cy.wait('@getIngredients')
    cy.wait('@getIngredients')

    cy.location('pathname').should('eq', '/')

    cy.get(CONSTRUCTOR_SELECTOR).as('constructor')
    cy.get('@constructor').should('exist')
  })

  it('оформляет заказ и очищает конструктор', () => {
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: { success: true, user: { name: 'Test', email: 'test@example.com' } }
    }).as('authUser')

    cy.intercept('POST', '**/api/orders', (req) => {
      const h = req.headers as Record<string, string | undefined>
      expect(h.authorization || h.Authorization).to.match(/^Bearer\s+/)

      req.reply({
        statusCode: 200,
        body: { success: true, order: { number: 12345 } }
      })
    }).as('createOrder')

    cy.setCookie('accessToken', 'Bearer test-token')
    cy.window().then((w) => w.localStorage.setItem('refreshToken', 'test-refresh'))

    cy.visit('/')
    cy.wait('@getIngredients')
    cy.wait('@getIngredients')
    cy.wait('@authUser')

    cy.contains(BUN_NAME)
      .closest(INGREDIENT_CONTAINER_SELECTOR)
      .within(() => {
        cy.contains('button', ADD_BUTTON_TEXT).click({ force: true })
      })

    cy.contains(FILLING_NAME)
      .closest(INGREDIENT_CONTAINER_SELECTOR)
      .within(() => {
        cy.contains('button', ADD_BUTTON_TEXT).click({ force: true })
      })

    cy.contains('button', 'Оформить заказ').click({ force: true })

    cy.wait('@createOrder')

    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.contains('12345', { timeout: 10000 }).should('be.visible')

    cy.get(CONSTRUCTOR_SELECTOR, { timeout: 10000 })
      .as('constructor')

    cy.get('@constructor').within(() => {
      cy.contains(/Выберите булк/i, { timeout: 10000 }).should('be.visible')
      cy.contains(/Выберите начинк/i, { timeout: 10000 }).should('be.visible')
      cy.contains(BUN_NAME).should('not.exist')
      cy.contains(FILLING_NAME).should('not.exist')
    })
  })

  afterEach(() => {
    cy.clearCookie('accessToken')
    cy.window().then((w) => w.localStorage.removeItem('refreshToken'))
  })
})
