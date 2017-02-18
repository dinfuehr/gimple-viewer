require 'tempfile'
require 'json'

def compile(path, content)
  passes = []
  Dir.mktmpdir do |dir|
    input = File.join(dir, "main.c")

    File.open(input, "w") do |f|
      f.write(content)
    end

    res = system(path, '-O3', '-fdump-tree-all', '-fdump-rtl-all', '-fdump-noaddr', '-fverbose-asm', '-S', input, chdir: dir, :err => "#{dir}/output", :out => "#{dir}/output")

    unless res
      output = File.read("#{dir}/output")
      return {
        error: true,
        output: output
      }
    end

    last = 0

    for entry in Dir[File.join(dir, "*")]
      name = File.basename(entry)

      if (m = name.match(/main\.c\.(\d{3})([rt])\.(\w+)/)) != nil
        num = m[1].to_i
        format = m[2]
        pass = m[3]

        next if pass == "tu"

        passes[num] = {
          name: pass,
          num: num,
          format: format == 't' ? :gimple : :rtl,
          content: File.read(entry)
        }

        last = [num, last].max
      end
    end

    passes[last+1] = {
      name: "assembly",
      num: last+1,
      format: :assembly,
      content: File.read("#{dir}/main.s")
    }
  end

  passes.delete_if { |x| x.nil? }
end

