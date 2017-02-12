new Vue({
  el: '#app',
  data: {
    code: "int foo(int a, int b) {\n  return a + b;\n}",
    passes: [],
    output: ""
  },
  methods: {
    compile: function() {
      $.ajax({
        url: "/compile",
        method: "POST",
        context: this,
        data: {
          name: 'system',
          code: $('#code').val()
        }
      }).done(function(result) {
        if (result.error) {
          this.passes = [];
          this.output = result.output;
        } else {
          this.passes = result;
          this.output = result[0].content;
        }
      });
    }
  }
});
