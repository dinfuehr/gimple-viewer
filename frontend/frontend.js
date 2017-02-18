var timeout;

new Vue({
  el: '#app',
  data: {
    code: "int foo(int a, int b) {\n  return a + b;\n}",
    passes: [],
    selected: undefined,
  },

  watch: {
    selected: function(val) {
      this.updateOutput(this.passes, val);
    },

    passes: function(val) {
      this.updateOutput(val, this.selected);
    }
  },

  mounted: function() {
    var editor = this.code_editor = ace.edit("code");
    editor.setTheme("ace/theme/solarized_light");
    editor.getSession().setMode("ace/mode/c_cpp");
    editor.getSession().on('change', function() {
      if (timeout)
        window.clearTimeout(timeout);

      timeout = window.setTimeout(function() {
        this.compile();
      }.bind(this), 500);
    }.bind(this));
    editor.setOptions({
      fontSize: '11pt'
    });

    editor = this.output_editor = ace.edit("output");
    editor.setTheme("ace/theme/solarized_light");
    editor.getSession().setMode("ace/mode/c_cpp");
    editor.setOptions({
      fontSize: '11pt'
    });
  },

  methods: {
    updateOutput: function(passes, selected) {
      var content = passes && selected ? (_.find(passes, { num: selected }).content) : "";
      this.output_editor.getSession().setValue(content);
    },

    compile: function() {
      $.ajax({
        url: "/compile",
        method: "POST",
        context: this,
        data: {
          name: 'system',
          code: this.code_editor.getSession().getValue()
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
