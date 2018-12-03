$(document).ready(() => {
  $('#ex-01-input').text(
    'stom-Wt80_S2_L001_R1_001.fastq.gz, stom-Wt80_S2_L002_R1_001.fastq.gz, stom-fb79_S1_L003_R2_001.fastq.gz, stom-fb78_S5_L001_R2_001.fastq.gz' +
    'stom-Wt80_S2_L003_R1_001.fastq.gz stom-Wt80_S2_L001_R2_001.fastq.gz stom-fb78_S5_L001_R1_001.fastq.gz stom-fb78_S5_L002_R1_001.fastq.gz' +
    'stom-fb78_S5_L003_R1_001.fastq.gz \n stom-Wt80_S2_L002_R2_001.fastq.gz \n stom-Wt80_S2_L003_R2_001.fastq.gz \n stom-fb79_S1_L001_R1_001.fastq.gz' +
    'stom-fb79_S1_L002_R1_001.fastq.gz - stom-fb79_S1_L003_R1_001.fastq.gz - stom-fb79_S1_L001_R2_001.fastq.gz - stom-fb79_S1_L001_R2_001.fastq.gz' +
    'stom-fb78_S5_L002_R2_001.fastq.gz asd stom-fb78_S5_L003_R2_001.fastq.gz \n\n' +
    'Different kind of separators are being used in this example. You can just click in the submit button to see how it works.');

  $('#ex-01-submit').bind('click', () => {
    $('#ex-01-result').html('Running...');
    $.ajax({
      type: 'POST',
      url: '/ex01',
      data: {'input': $('#ex-01-input').val()}
    }).done((response) => {
      let result = response.output ? response.output.join('<br />') : '';
      result += '<br /><pre><samp>' + JSON.stringify(response.result, null, 2) + '</samp></pre>';
      $('#ex-01-result').html(result);
    }).fail((jqXHR, textStatus, errorThrown) => {
      $('#ex-01-result').html(`${textStatus}: ${errorThrown}`);
    });
  });

  $('#ex-02-submit').bind('click', () => {
    $('#ex-02-result').html('Running...');
    $.ajax({
      type: 'POST',
      url: '/ex02',
      data: {}
    }).done((response) => {
      let result = response.output ? response.output.join('<br />') : '';
      result += '<br /><pre><samp>' + JSON.stringify(response.result, null, 2) + '</samp></pre>';
      $('#ex-02-result').html(result);
      (new StackedBarChart).init('#ex-02-svg-stacked-bar-chart', response.result, 800, 200);
      $('#ex-02-svg-stacked-bar-chart').removeClass('d-none');
    }).fail((jqXHR, textStatus, errorThrown) => {
      $('#ex-02-result').html(`${textStatus}: ${errorThrown}`);
    });
  });

  let scatterPlot = null;
  $('#ex-03-submit').bind('click', () => {
    $('#ex-03-submit').attr('disabled', 'disabled');
    $('#ex-03-thld-pvalue').attr('disabled', 'disabled');
    $('#ex-03-thld-max-log2-fold-change').attr('disabled', 'disabled');
    $('#ex-03-thld-min-log2-fold-change').attr('disabled', 'disabled');
    const defaultThld = {
      pvalue: 2,
      maxLog2FoldChange: 2,
      minLog2FoldChange: -2
    };
    scatterPlot = (new ScatterPlot).init('#ex-03-svg-scatter-plot', defaultThld, 800, 300);
    $('#ex-03-svg-scatter-plot').removeClass('d-none');
    $('#ex-03-svg-scatter-plot-canvas').removeClass('d-none');
    var socket = io.connect('http://localhost:3000');
    socket.emit('Ex03 start');
    scatterPlot.startInterval();
    socket.on('Add dot', (dot) => {
      scatterPlot.addPoint(dot);
    });
    socket.on('File closed', () => {
      $('#ex-03-submit').removeAttr('disabled');
      $('#ex-03-thld-pvalue').removeAttr('disabled');
      $('#ex-03-thld-max-log2-fold-change').removeAttr('disabled');
      $('#ex-03-thld-min-log2-fold-change').removeAttr('disabled');
      socket.close();
      scatterPlot.stopInterval();
    });
  });

  let updateScatterPlotTimer = null;
  const updateScatterPlot = () => {
    if (scatterPlot) {
      if (updateScatterPlotTimer) clearTimeout(updateScatterPlotTimer);
      updateScatterPlotTimer = setTimeout(() => {
        scatterPlot.setThreshold({
          pvalue: $('#ex-03-thld-pvalue').val(),
          maxLog2FoldChange: $('#ex-03-thld-max-log2-fold-change').val(),
          minLog2FoldChange: $('#ex-03-thld-min-log2-fold-change').val(),
        });
      }, 2000);
    }
  };
  $('#ex-03-thld-pvalue').bind('keyup', () => {
    updateScatterPlot();
  });

  $('#ex-03-thld-max-log2-fold-change').bind('keyup', () => {
    updateScatterPlot();
  });

  $('#ex-03-thld-min-log2-fold-change').bind('keyup', () => {
    updateScatterPlot();
  });
});
