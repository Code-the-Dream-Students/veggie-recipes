//----------------------------- CLIENT-SIDE REGISTER INPUT VALIDATION -------------- DeeTheDev
// ** Boostrap example validation
window.addEventListener(
    "load",
    function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName("needs-validation");
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener(
                "submit",
                function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }else{
                        event.preventDefault();
                        retriveData();
                    }
                    form.classList.add("was-validated");
                },
                false
            );
        });
    },
    false
);

//Server-side error handling.
// source from: https://gist.github.com/chrislkeller/3230081

var jqueryNoConflict = jQuery;

// jqueryNoConflict("#submitRegisterForm").(function(){
//     retriveData();
// });

// grab data
function retriveData() {
    var dataSource = '/errorHandling';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// render compiled handlebars template
function renderDataVisualsTemplate(data){
    const errorHandlingHbs = $('#the-template').html;
    handlebarsDebugHelper();
    renderHandlebarsTemplate(errorHandlingHbs, '#errorResponse', data);
};

// render handlebars templates via ajax
function getTemplateAjax(path, callback) {
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            console.log(source);
            if (callback) callback(template);
        }
    });
};

// function to compile handlebars template
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// add handlebars debugger
function handlebarsDebugHelper(){
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
    });
};