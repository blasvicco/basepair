# basepair

In this project you will find three exercises about reading files, parsing large amount of data and representing the information in cool charts.

##### Some of the technologies used in this project are:
  - [NodeJS](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [Socket.IO](https://socket.io/)
  - [HandlebarsJS](https://handlebarsjs.com/)
  - [D3JS](https://d3js.org/)
  - [JQuery](https://jquery.com/)
  - [Bootstrap](https://getbootstrap.com/)
  - [Docker](https://www.docker.com/)

## Instalation
Everything is running in a docker so with this simple steps you will have it running in your computer:

```BASH
git clone https://github.com/blasvicco/basepair.git
cd basepair
docker-compose build
docker-compose up
```

Then you can just hit your localhost like [http://localhost:3000/].
Do not forget to turn it off with `CRTL+C` when you done.

## Exercise I:
The first exercise use some regular expresion to find filenames that match a particular pattern inside a bunch of text. Then filenames that were found in the text will be grouped in an object following the next rule:

> The filenames have a pattern like sample_name_L00x_Ry_001.fastq.gz. The x is the lane number (L). If the sample is single-end, `y` will be 1. If the sample is paired-end, `y` will be 1 for forward read and 2 for reverse read files.

An example of desired output giving an input like this:
```
stom-Wt80_S2_L001_R1_001.fastq.gz, stom-Wt80_S2_L002_R1_001.fastq.gz,
stom-fb79_S1_L003_R2_001.fastq.gz, stom-fb78_S5_L001_R2_001.fastq.gz
stom-Wt80_S2_L003_R1_001.fastq.gz stom-Wt80_S2_L001_R2_001.fastq.gz stom-fb78_S5_L001_R1_001.fastq.gz
stom-fb78_S5_L002_R1_001.fastq.gzstom-fb78_S5_L003_R1_001.fastq.gz
stom-Wt80_S2_L002_R2_001.fastq.gz
stom-Wt80_S2_L003_R2_001.fastq.gz
stom-fb79_S1_L001_R1_001.fastq.gzstom-fb79_S1_L002_R1_001.fastq.gz - stom-fb79_S1_L003_R1_001.fastq.gz -
stom-fb79_S1_L001_R2_001.fastq.gz - stom-fb79_S1_L001_R2_001.fastq.gz
stom-fb78_S5_L002_R2_001.fastq.gz asd stom-fb78_S5_L003_R2_001.fastq.gz
```
will be:
```JSON
[
  {
    "name": "stom-Wt80",
    "fwd_files": [
      "stom-Wt80_S2_L001_R1_001.fastq.gz",
      "stom-Wt80_S2_L002_R1_001.fastq.gz",
      "stom-Wt80_S2_L003_R1_001.fastq.gz"
    ],
    "rev_files": [
      "stom-Wt80_S2_L001_R2_001.fastq.gz",
      "stom-Wt80_S2_L002_R2_001.fastq.gz",
      "stom-Wt80_S2_L003_R2_001.fastq.gz"
    ]
  },
  {
    "name": "stom-fb79",
    "fwd_files": [
      "stom-fb79_S1_L001_R1_001.fastq.gz",
      "stom-fb79_S1_L002_R1_001.fastq.gz",
      "stom-fb79_S1_L003_R1_001.fastq.gz"
    ],
    "rev_files": [
      "stom-fb79_S1_L003_R2_001.fastq.gz",
      "stom-fb79_S1_L001_R2_001.fastq.gz",
      "stom-fb79_S1_L001_R2_001.fastq.gz"
    ]
  },
  {
    "name": "stom-fb78",
    "fwd_files": [
      "stom-fb78_S5_L001_R1_001.fastq.gz",
      "stom-fb78_S5_L002_R1_001.fastq.gz",
      "stom-fb78_S5_L003_R1_001.fastq.gz"
    ],
    "rev_files": [
      "stom-fb78_S5_L001_R2_001.fastq.gz",
      "stom-fb78_S5_L002_R2_001.fastq.gz",
      "stom-fb78_S5_L003_R2_001.fastq.gz"
    ]
  }
]
```

## Exercise II:
The second exercise is a comparison between frames of pings. The script will read two files that contain the output of the `ping` command and it will generate a chart to compare which one has a better time response.
The input files should look like:
```
PING www.google.com (172.217.11.36): 56 data bytes
64 bytes from 172.217.11.36: icmp_seq=0 ttl=49 time=5.730 ms
64 bytes from 172.217.11.36: icmp_seq=1 ttl=49 time=5.673 ms
64 bytes from 172.217.11.36: icmp_seq=2 ttl=49 time=5.160 ms
64 bytes from 172.217.11.36: icmp_seq=3 ttl=49 time=5.651 ms
64 bytes from 172.217.11.36: icmp_seq=4 ttl=49 time=3.383 ms
64 bytes from 172.217.11.36: icmp_seq=5 ttl=49 time=5.135 ms
64 bytes from 172.217.11.36: icmp_seq=6 ttl=49 time=6.161 ms
64 bytes from 172.217.11.36: icmp_seq=7 ttl=49 time=4.919 ms
64 bytes from 172.217.11.36: icmp_seq=8 ttl=49 time=5.313 ms
64 bytes from 172.217.11.36: icmp_seq=9 ttl=49 time=4.059 ms
64 bytes from 172.217.11.36: icmp_seq=10 ttl=49 time=3.943 ms
64 bytes from 172.217.11.36: icmp_seq=11 ttl=49 time=4.235 ms
64 bytes from 172.217.11.36: icmp_seq=12 ttl=49 time=4.183 ms
64 bytes from 172.217.11.36: icmp_seq=13 ttl=49 time=5.230 ms
64 bytes from 172.217.11.36: icmp_seq=14 ttl=49 time=4.255 ms
64 bytes from 172.217.11.36: icmp_seq=15 ttl=49 time=5.297 ms
64 bytes from 172.217.11.36: icmp_seq=16 ttl=49 time=5.021 ms
64 bytes from 172.217.11.36: icmp_seq=17 ttl=49 time=5.268 ms
64 bytes from 172.217.11.36: icmp_seq=18 ttl=49 time=3.445 ms
64 bytes from 172.217.11.36: icmp_seq=19 ttl=49 time=4.754 ms

--- www.google.com ping statistics ---
20 packets transmitted, 20 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 3.383/4.841/6.161/0.759 ms
```

And the script will generate an output that looks like:
```JSON
{
  "new": {
    "data": [
      5.73,
      5.673,
      5.16,
      5.651,
      3.383,
      5.135,
      6.161,
      4.919,
      5.313,
      4.059,
      3.943,
      4.235,
      4.183,
      5.23,
      4.255,
      5.297,
      5.021,
      5.268,
      3.445,
      4.754
    ],
    "stats": {
      "min": 3.383,
      "avg": 4.841,
      "max": 6.161,
      "stddev": 0.759
    }
  },
  "old": {
    "data": [11.912, "..."],
    "stats": {
      "min": 4.85,
      "avg": 16.805,
      "max": 104.141,
      "stddev": 25.531
    }
  }
}
```
This data structure will be used to generate a chart with D3JS.

## Exercise III:
For the thrid exercise was required to read a large file, process the data and generate an interactive `Scatter Plot` with some editable threshold that allow us to identify different sets of data in the chart.

Considering the size of the file, I decided to use `Socket.IO` to send partial data while the file is being read. In that way, the user will be able to see some results, as soon as the first line of the file is been processed.

A couple of challenges need to be addressed for reaching this goal. The most importat one is to scale the chart dinamically while new data is being added to it. D3JS zoom and translate were used to solve that.

Another issue is about the amount of dots to plot. SVG has a very low performance if we want to add dom elements to represent the dots. A good approach is plotting the dots in a helper `canvas` element.

That brings another problem to the surface, and it is `keeping the correspondency between the axes (added in the svg element) with the dots coords (plotted in the canvas element)`, nothing that cannot be solve using D3JS libs.


