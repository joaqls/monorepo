describe('Modulo de Jugadores', () => {
  beforeEach(() => {
    cy.visit('/jugadores');
  });

  it('crea un nuevo jugador y lo muestra en el listado', () => {
    cy.get('[data-testid="jugador-nombre"]').type('Sergio Ramos');
    cy.get('[data-testid="jugador-equipo"]').type('Sevilla FC');
    cy.get('[data-testid="jugador-deporte"]').type('Futbol');
    cy.get('[data-testid="jugador-guardar"]').click();

    cy.get('[data-testid="jugador-row-nombre"]').should('contain', 'Sergio Ramos');
  });

  it('muestra un error al intentar crear un jugador con datos invalidos', () => {
    cy.get('[data-testid="jugador-nombre"]').type('Jugador incompleto');
    cy.get('[data-testid="jugador-guardar"]').click();

    cy.get('[data-testid="jugador-error"]')
      .should('be.visible')
      .and('contain', 'Completa nombre, equipo y deporte.');
  });
});
