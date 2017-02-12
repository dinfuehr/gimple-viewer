new Vue({
  el: '#app',
  data: {
    code: "int foo(int a, int b) {\n  return a + b;\n}",
    passes: [],
    output: ""
  },

  mounted: function() {
    var editor = ace.edit("code");
    editor.setTheme("ace/theme/solarized_light");
    editor.getSession().setMode("ace/mode/c_cpp");
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
