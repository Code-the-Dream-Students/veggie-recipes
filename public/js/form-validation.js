//----------------------------- CLIENT-SIDE REGISTER INPUT VALIDATION -------------- DeeTheDev
//Jquery doc on ready
$(document).ready(()=> {
    window.addEventListener(  "load",  () => {
        registerForm.addEventListener("submit", (event)=> {
            // ** Boostrap validation with checkValidity
            if (registerForm.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }else{
                        event.preventDefault();
                        // Register User with Ajax call OR return error msg
                        sendRegisterPostAjax();
                        event.stopPropagation();
                    }
                    registerForm.classList.add("was-validated");
                })
        },
        false
    );
    
    //Server-side error handling.
    //Helpful resource: https://gist.github.com/chrislkeller/3230081

    const jqueryNoConflict = jQuery;
    
    //send data along with POST request to REGISTER route
    sendRegisterPostAjax = () => {
        const registerForm = document.getElementById("registerForm");
        const registerFormData = new FormData(registerForm);
        const data = {
            userName: registerFormData.get("userName"),
            email: registerFormData.get("email"),
            password: registerFormData.get("password"),
            confirmPassword: registerFormData.get("confirmPassword"),
        };
        let source;
        jqueryNoConflict.ajax({
            type: "POST",
            url: "/register",
            data,
        })
        .done(() => {
            //when user created > redirect home as USER loggedIn
            window.location.href = window.location.origin + '/';
        })
        .error((errors) => {
            //JSON.parse loads data into object
            source = JSON.parse(errors.responseText);
            // Handlebars DEBUGGER
            // handlebarsDebugHelper();
            //Load JSON and renderDataVisualsTemplate function
            renderHandlebarsTemplate('/errors/errorHandling.hbs', '#errorResponse', source);
        })
    }
    function getTemplateWithErrors(path, callback) {
        let source, template;
        jqueryNoConflict.ajax({
            url: path,
            success: (data) => {
                source = data;
                template = Handlebars.compile(source);
                if(callback) callback(template);
            }
        })
    }
    function renderHandlebarsTemplate(withTemplatePath, inElement, withData){
        getTemplateWithErrors(withTemplatePath, function(template) {
            jqueryNoConflict(inElement).html(template(withData));
        })
    }
    // add handlebars debugger
    handlebarsDebugHelper = () =>{
        Handlebars.registerHelper("debug", (optionalValue) => {
            console.log("Current Context");
            console.log("====================");
            console.log(this);
        });
    };

})