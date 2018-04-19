$(function() {
  $("form[name='registration']").validate({
    rules: {
      name: "required",
      email: {
        required: true,
        email: true
      },
      subject: {
        required: true,
        minlength: 3
      },
      message: {
        required: true,
        minlength: 5
      }
    },

    messages: {
      name: "Please enter your Name",
      lastname: "Please enter your lastname",
      message: {
        required: "Please provide your message.",
        minlength: "Your message must be at least 5 characters long"
      },
	  subject: {
        required: "Please provide appropriate subject.",
        minlength: "Subject must be at least 3 characters long"
      },
      email: "Please enter a valid email address"
    },
    submitHandler: function(form) {
      form.submit();
    }
  });
});
