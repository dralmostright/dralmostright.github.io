---
layout:	unixdbacmd
title:	"Basic Commands Every Unix DBA Should Know Part-I"
date:	2018-05-31 12:20:00
category: unixdbacmd
metadata: "Basic Commands Every Unix DBA Should Know Part-I"
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

<span>
	<strong>3. ps</strong>
	<br />
</span>
So ps is one of the fundamental command that every unix dba should know. As *\*nix* is a multitasking and multi-user system, allowing multiple process operate concurrently independently and also it is the siginificant aspect/concept that places *\*nix* O/S at dominance. So *\*nix* offer a utility ps to monitor the information associated the process. ps command is used to list the currently running processes and their PIDs along with some other information depends on different options. 

ps provides numerous options for manipulating the output according to our need. I will be discussing some basic as well as moderate use of ps command. 

Lets start with default usage. By symply typing ps command it lists all the process on the current shell. We can witness as below:
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">
<code class="bash">
[root@rhost ~]# ps
  PID TTY          TIME CMD
 6049 pts/4    00:00:00 bash
 6159 pts/4    00:00:00 bash
 6269 pts/4    00:00:00 ps
[root@rhost ~]# 
 </code>
</pre>

where,
<ul style="list-style-type:disc; margin-left: 2em">
<li><strong>PID</strong> the unique process ID</li>
<li><strong>TTY</strong> terminal type that the user is logged into</li>
<li><strong>TIME</strong> amount of CPU in minutes and seconds that the process has been running</li>
<li><strong>CMD</strong>  name of the command that launched the process</li>
</ul>

Likewise we can append some flags for for detail information. ps with -e flag lists all the active process in *\*nix* box. 
<ol type="1" style="margin-left: 2em; list-style-type: decimal; margin-top: -1.5em;">
<li>ps -ef : lists all the full format process information</li>
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">
<code class="bash">
[root@rhost ~]# ps -ef
UID        PID  PPID  C STIME TTY          TIME CMD
root         1     0  0 23:03 ?        00:00:10 /usr/lib/systemd/systemd --switched-root --system --deserialize 21
root         2     0  0 23:03 ?        00:00:00 [kthreadd]
root         3     2  0 23:03 ?        00:00:00 [ksoftirqd/0]
root         5     2  0 23:03 ?        00:00:00 [kworker/0:0H]
root         6     2  0 23:03 ?        00:00:00 [kworker/u:0]
 </code>
</pre>


<li>ps -fU ##username : list all the process run by user ##username e.g: ps -fU suman</li>
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">
<code class="bash">
[root@rhost ~]# ps -fU suman
UID        PID  PPID  C STIME TTY          TIME CMD
suman     1266     1  0 23:04 ?        00:00:00 /usr/bin/Xvnc :4 -desktop rhost.localdomain:4 (suman) -auth /workspace/suman/.Xauthority -geometry 1024x768 -rfbwait 30000 -rfbauth /workspace/
suman     1291     1  0 23:04 ?        00:00:00 /usr/bin/Xvnc :5 -desktop rhost.localdomain:5 (suman) -auth /workspace/suman/.Xauthority -geometry 1280x720 -rfbwait 30000 -rfbauth /workspace/
suman     1327     1  0 23:04 ?        00:00:00 /usr/bin/vncconfig -iconic
suman     1329     1  0 23:04 ?        00:00:00 /bin/gnome-session --session=gnome-classic
 </code>
</pre>
<li>ps -fG ##groupname : list all the process owned by group ##groupname e.g. ps -fG suman</li>
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">
<code class="bash">
[root@rhost ~]# ps -fG home
UID        PID  PPID  C STIME TTY          TIME CMD
suman     1327     1  0 23:04 ?        00:00:00 /usr/bin/vncconfig -iconic
suman     1329     1  0 23:04 ?        00:00:00 /bin/gnome-session --session=gnome-classic
suman     1338     1  0 23:04 ?        00:00:00 dbus-launch --sh-syntax --exit-with-session
suman     1352     1  0 23:04 ?        00:00:00 /usr/bin/vncconfig -iconic
suman     1354     1  0 23:04 ?        00:00:00 /bin/gnome-session --session=gnome-classic
 </code>
</pre>

<li>ps -e --forest : list the all process with their process span tree</li>
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">
<code class="bash">
[root@rhost ~]# ps -e --forest
  PID TTY          TIME CMD
. . . . . . .
. . . . . . .
  905 ?        00:00:00 sshd
 2918 ?        00:00:01  \_ sshd
 4480 pts/1    00:00:00      \_ bash
 4616 pts/1    00:00:12      |   \_ ruby
 6049 pts/4    00:00:00      \_ bash
 6159 pts/4    00:00:00          \_ bash
 9040 pts/4    00:00:00              \_ ps
. . . . . . .
. . . . . . .
 </code>
</pre>
You can also view process tree by specifying the program name like:
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">
<code class="bash">
[root@rhost ~]# ps -f --forest -C chrome
UID        PID  PPID  C STIME TTY          TIME CMD
root      4733  4633  2 Jul01 pts/2    00:01:09 /opt/google/chrome/chrome --no-sandbox
root      4821  4733  0 Jul01 pts/2    00:00:02  \_ /opt/google/chrome/chrome --type=zygote --no-sandbox
root      5017  4821  1 Jul01 pts/2    00:00:34      \_ /opt/google/chrome/chrome --type=renderer --no-sandbox --field-trial-handle=1 --primordial-pipe-token=71ECBFA37DAFD4DFB683E60120F77203 
[root@rhost ~]# 
 </code>
</pre>

One can also view the all process instances running on the box issuing below command
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">
<code class="bash">
[root@rhost ~]# ps -fL -C chrome
UID        PID  PPID   LWP  C NLWP STIME TTY          TIME CMD
root      4733  4633  4733  0   32 Jul01 pts/2    00:00:34 /opt/google/chrome/chrome --no-sandbox
root      4733  4633  4819  0   32 Jul01 pts/2    00:00:00 /opt/google/chrome/chrome --no-sandbox
root      4733  4633  4846  0   32 Jul01 pts/2    00:00:00 /opt/google/chrome/chrome --no-sandbox
root      4733  4633  4847  0   32 Jul01 pts/2    00:00:00 /opt/google/chrome/chrome --no-sandbox
</code>
</pre>

If you want more you can view the go to link : https://www.freebsd.org/cgi/man.cgi?query=ps&manpath=SuSE+Linux/i386+11.3

<hr>
Here comes the end for our first unix dba cmd/tools. We will discuss more on next blog. Stay tuned.
</ol> 


