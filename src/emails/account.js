const sgMail = require('@sendgrid/mail');

const sendgridAPIKEY = `${process.env.EMAIL_API_KEY}`;

sgMail.setApiKey(sendgridAPIKEY);

const produceRecipe = (recipe) => {
    const { title, image, summary, cookingMinutes, readyInMinutes, servings, ingredients, steps, favorite } = recipe;

    return ` 
    <div class="row">
      <div class="col-sm-4 col-md-4">
        <img id="recipe-image" alt="Responsive image" class="img-responsive modal-img" src=${image}>
      </div>
      <div class=" col-sm-8 col-md-8">
        <h1 id="recipe-title-h1" class=" main-title-modal">${title}</h1>
        <p id="recipe-summary" >${summary}</p>
      </div>
    </div>
    <section class="fieldset">
      <div class="specs-wrapper">
        <h4>Specs</h4>
        <div class="specs">

          <div class="specs-content">
            <h2> Cook Time </h2>
            <div class="specs">
              <div class="wrapper-specs">
                <h3 id="recipe-cooking-minutes" >${cookingMinutes ? cookingMinutes : readyInMinutes} </h3>
              </div>
              <div class="specs-minutes">minutes </div>
            </div>
          </div>

          <div class="specs-content">
            <h2> Total</h2>
            <div class="specs">
              <div class="wrapper-specs">
                <h3 id="recipe-ready-in-minutes" >${readyInMinutes}</h3>
              </div>
              <div class="specs-minutes">minutes </div>
            </div>
          </div>
          <div class=" specs-content">
            <h2>Servings</h2>
            <div class=" specs">
              <div class="wrapper-specs">
                <h3 id="recipe-servings" class="price">${servings}</h3>
              </div>
              <div class="specs-minutes">people</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="row">
      <div class="col-sm-6 col-md-6">
        <h1 class="sub-title-modal">Ingredients</h1>
        <ul id="recipe-ingredients">${ingredients.reduce((acc, ingredient) => acc += `<li>${ingredient}</li>`,"")}</ul>
      </div>
      <div class="col-sm-6 col-md-6">
        <h1 class="sub-title-modal">Steps</h1>
        <ul id="recipe-steps">${steps.reduce((acc, step) => acc += `<li>${step}</li>`,"")}</ul>
      </div>
    </div>
    <div class="additional-recipes">
  </div>

  `
}

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'info.vegeloper@gmail.com',
        subject: 'Thanks for joining Veggie Recipes!',
        text: `Welcome to Veggie Recipes ${name}! Hope you enjoy our app!`
    })
}

const resetPasswordEmail = (email, name, password) => {
    sgMail.send({
        to: email,
        from: 'info.vegeloper@gmail.com',
        subject: 'Request for forgotten password',
        html: `Hello ${name}! Here is a temporary password to login. Once you're logged in, you can reset your password after you're logged in. 
                <div>
                    <strong>Password:</strong> ${password}
                </div>`
    })
}

const newPasswordEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'info.vegeloper@gmail.com',
        subject: 'Confirmation of password change',
        html: `Hello ${name}! You have succesfully changed your password.`
    })
}

const updateUserEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'info.vegeloper@gmail.com',
    subject: `Hello ${name}! You have successfully updated your user information!`,
    html: `Hello ${name}! You have succesfully updated your user information!`
  })
}

const recipeEmail = (email, name, recipe) => {
    sgMail.send({
        to: email,
        from: 'info.vegeloper@gmail.com',
        subject: `Hello ${name}! Here's your ${recipe.title} recipe!`,
        html: `${produceRecipe(recipe)}`
    })
}


module.exports = {
    sendWelcomeEmail,
    resetPasswordEmail,
    newPasswordEmail,
    recipeEmail,
    updateUserEmail
};