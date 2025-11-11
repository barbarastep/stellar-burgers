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
})
