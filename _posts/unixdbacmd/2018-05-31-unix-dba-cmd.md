---
layout:	unixdbacmd
title:	"Basic Commands Every Unix DBA Should Know"
date:	2018-05-31 12:20:00
category: unixdbacmd
metadata: "Basic Commands Every Unix DBA Should Know"
---

<a href="#" class="image featured"> <img src="/images/cmdwordcloud.png" alt=""/> </a>

<header>
		<h3>O/S specific commands (Unix)</h3>
</header>
<p> Here I will discuss some important Unix commands that every Unix DBA's should be familiar with. Though I am not prioritizing the commands but I think its good to know them all.
</p>

<span>
	<strong>1. tail</strong>
	<br />
</span>

<p>So here comes our first command tail. This command is basically used to display last given lines of a file. By default, tail will output the last 10 lines of its input 
to the standard output. Though the amount of output lines can be adjusted as per our need using appropriate flags. I basically use this command for real time reporting and 
monitoring when ever i am configuring/maintaining/installing a new component in a unix box. I will give some small demo too for using the appropriate syntax:</p>

<p style=" margin-bottom: -1em;">Using default tail:</p>
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">
<code class="bash">
[oracle@test trace]$ tail alert_test.log
Archived Log entry 23340 added for thread 1 sequence 10608 ID 0x21188f06 dest 1:
Tue Jun 05 02:00:00 2018
Closing scheduler window
Closing Resource Manager plan via scheduler window
Clearing Resource Manager plan via parameter
Tue Jun 05 06:05:39 2018
Thread 1 advanced to log sequence 10610 (LGWR switch)
  Current log# 2 seq# 10610 mem# 0: /oradata/test/redo02.log
Tue Jun 05 06:05:40 2018
Archived Log entry 23341 added for thread 1 sequence 10609 ID 0x21188f06 dest 1:
[oracle@test trace]$
  </code>
</pre>
<p >What if you want to view only two last lines. You can do it by specifying <strong>-2</strong> immediately after tail command and file to monitor. You can specify any <strong>n</strong> number of lines where n can be any values 1, 200, 5000 etc. But remember if you file is of big enough you should consider your box's resource.</p>

<p style=" margin-bottom: -1em;">Again What if you want to view only 5 last lines and thereafter realtime monitoring. You can do it by specifying <strong>-5f</strong> immediately after tail command and file to monitor.</p>
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">
<code class="bash">
[oracle@test trace]$ tail -5f alert_test.log
Setting Resource Manager plan DEFAULT_MAINTENANCE_PLAN via parameter
Tue Jun 05 22:00:00 2018
Starting background process VKRM
Tue Jun 05 22:00:00 2018
VKRM started with pid=39, OS id=31838
  </code>
</pre>

<span>
	<strong>2. head</strong>
	<br />
</span>
<p style=" margin-bottom: -1em;"><strong>head</strong> command is another useful command for Unix DBA's. It will output the first n part of files given to it via standard input to standard output. 
By default head returns the first ten lines of each file that it is given. You can also head multiple files at once too. You can have reference as below:</p>
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black;">
<code class="bash">
[oracle@test trace]$ head -5 alert_test.log
Mon Jan 05 17:45:59 2015
Errors in file /u01/app/oracle/diag/rdbms/test/test/trace/test_j000_31350.trc:
ORA-12012: error on auto execute of job "EXFSYS"."RLM$SCHDNEGACTION"
ORA-04045: errors during recompilation/revalidation of NU_LIVE_31_MAR.TRG_MFIN_LOGOFF
ORA-01031: insufficient privileges
[oracle@test trace]$

[oracle@test trace]$ head alert_test.log test_mmon_3000.trm
==> alert_test.log <==
Mon Jan 05 17:45:59 2015
Errors in file /u01/app/oracle/diag/rdbms/test/test/trace/test_j000_31350.trc:
ORA-12012: error on auto execute of job "EXFSYS"."RLM$SCHDNEGACTION"
ORA-04045: errors during recompilation/revalidation of NU_LIVE_31_MAR.TRG_MFIN_LOGOFF
ORA-01031: insufficient privileges
Errors in file /u01/app/oracle/diag/rdbms/test/test/trace/test_j000_31350.trc:
ORA-04045: errors during recompilation/revalidation of NU_LIVE_31_MAR.TRG_MFIN_LOGOFF
ORA-01031: insufficient privileges
ORA-12012: error on auto execute of job "EXFSYS"."RLM$SCHDNEGACTION"
ORA-04045: errors during recompilation/revalidation of NU_LIVE_31_MAR.TRG_MFIN_LOGOFF

==> test_mmon_3000.trm <==
@2|2|XJ8eGcq32"3000|test|
M/XJ8eGcq32~I1Q2
3?R2~rJ
M?lW2eGcq32~B8b1
J?bh81I~Ub1
J?HYAvH~Ub1
J?zlb4I~1b1
J?MhS4I~Ub1
J?oZN4I~Ub1
J?f+e4I~1b1
[oracle@test trace]$
  </code>
</pre>