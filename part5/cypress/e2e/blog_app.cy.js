/* eslint-disable no-undef */
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Admin',
      username: 'admin',
      password: '12345'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    it('front page can be opened', function() {
      cy.contains('Log into application')
      cy.contains('username')
      cy.contains('password')
    })
  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('12345')
      cy.get('#login-button').click()

      cy.contains('Admin logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('jaredk')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })
  describe('when logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', { username: 'admin', password: '12345' })
        .then(response => {
          localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })
    })

    it('a new blog can be created', function() {
      cy.contains('New Blog').click()
      cy.get('.title').type('Another Blog...')
      cy.get('.author').type('Author')
      cy.get('.url').type('example.com')
      cy.get('.create-button').click()
      cy.contains('Another Blog...')
    })
    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.contains('New Blog').click()
        cy.get('.title').type('Another Blog...')
        cy.get('.author').type('Author')
        cy.get('.url').type('example.com')
        cy.get('.create-button').click()
      })

      it('blog can be liked', function () {
        cy.contains('View')
          .click()

        cy.contains('Like')
          .click()
        cy.get('.likes')
          .contains(1)
      })
      it('blog can be deleted by user who created it', function () {
        cy.contains('View')
          .click()

        cy.contains('Delete')
          .click()
        cy.get('html').should('not.contain', 'View')
      })
    })
  })
  describe('Two users at once', function() {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const user = {
        name: 'Jared Klopstein',
        username: 'JaredKlopstein',
        password: 'cash123'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)

      cy.request('POST', 'http://localhost:3003/api/login', { username: 'JaredKlopstein', password: 'cash123' })
        .then(response => {
          localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })

      cy.contains('New Blog').click()
      cy.get('.title').type('Jared Klopstein Blog')
      cy.get('.author').type('Jared Klopstein')
      cy.get('.url').type('example.com')
      cy.get('.create-button').click()


      const anotherUser = {
        name: 'Cash Klopstein',
        username: 'CashKlopstein',
        password: 'jared123'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', anotherUser)

      cy.request('POST', 'http://localhost:3003/api/login', { username: 'CashKlopstein', password: 'jared123' })
        .then(response => {
          localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })
      cy.contains('New Blog').click()
      cy.get('.title').type('Cash Klopstein Blog')
      cy.get('.author').type('Cash Klopstein')
      cy.get('.url').type('example.com')
      cy.get('.create-button').click()
    })
    it('blog can\'t be deleted by user who didn\'t create it, but can delete their own', function () {
      cy.contains('View')
        .click()
      cy.get('html').should('not.contain', 'Delete')
      cy.contains('View')
        .click()
      cy.get('html').should('contain', 'Delete')
    })
  })
})