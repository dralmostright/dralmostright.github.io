---
layout:	unixdbatools
title:	"Some hands/tricks on with Oracle export/import"
date:	2018-05-31 12:20:00
category: unixdbatools
metadata: "Basic Commands Every Unix DBA Should Know"
---

<a href="#" class="image featured"> <img src="/images/expdp-impdp.png" alt=""/> </a>

<header>
		<h3>Some hands on with Oracle export/import</h3>
</header>


So today I will share some tips/tricks with reagrding to Oracle export/import(expdp/impdp). We will not be discussing the lagacy exp/imp here. We will go through some tips and 
tricks helpful in different senarios during import or export.

<strong>Situation 1:</strong>
I want to export a user schema lets say BANKUSR from production to test for devlopment for further testing purpose.


<strong>Challanges:</strong>
<ol type="1" style="margin-left: 2em; list-style-type: decimal; margin-top: -1.5em;">
<li>The test env already have BANKUSR schema</li>
<li>The physical structure of test db instance is different from prod db instance</li>
</ol> 

<strong>Solution:</strong>
Whenever we are in above mentioned situation, we can trick it by using appropriate parameter like REMAN_SCHEMA, REMAP_TABLESPACE. 

Also there are some few remap parameters which i would like to discuss here:

<strong style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">remap_data</strong>: It can we used for permanent data masking during logical restore, which will take the sources original value of the designated column and returns a remapped value 
that will replace the original value in the dump file but you have to develop a masking function and specify explictly.

The basic syntax is:
<strong style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">REMAP_DATA=[schema.]tablename.column_name:[schema.]pkg.function</strong>


If you want more please refer to like : [Oracle Logical Backup.](https://docs.oracle.com/database/121/SUTIL/GUID-B1D13216-93D3-4FFC-A0BB-082E133FD2B9.htm#SUTIL861)

<strong style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">remap_datafile</strong>:
This parameter is greatly helpful when you are doing a whole database migration and are not interested to directory structure same as previous you can do it 
by providing appropirate parameters.

The below listed parameters more general and widely used:

<strong style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">remap_schema</strong>: Use when source and destination schema name are/want different

<strong style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">remap_table</strong>: Use when source and destination table name are/want be different

<strong style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">remap_tablespace </strong>: Use when source and destination tablespace are/want or are  different

<strong>Situation 2:</strong>
You are given a dump file from production and told to restore.

<strong>Challanges:</strong>
<ol type="1" style="margin-left: 2em; list-style-type: decimal; margin-top: -1.5em;">
<li> You are not known whether its done by expdp or lagacy emp</li>
<li> You are not given physical/logical structure details</li>
<li> You are not given the schema user details</li>
<li> You are not known the database characterset</li>
</ol> 

<strong>Solution:</strong>
So few challanges right, what should one go for next. As enumerated above we will also make our action plan according to them.

1) Identify whether it was done with expdp/exp 
So our first step would be to identify the tool that was used to take logical backup. We can do it by using unix command strings & head.

<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black; margin-top: -3.5em;">
<code class="bash">
[oracle@oradr ~]$ strings appmeta.dmp | head -5
"SYS"."SYS_EXPORT_SCHEMA_01"
x86_64/Linux 2.4.xx
orcl
US7ASCII
11.02.00.00.00
  </code>
</pre>


So if you encounter similar like <strong style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">EXPORT_SCHEMA</strong>, then we can conclude it was taken with expdp otherwise was lagacy exp.

2) Identify the database characterset
With above command you can also get the characterset of the source database as in above case is <strong style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black">US7ASCII</strong>.

3) Identifying the schema name and logical structures
The step is simple, we can do it by generating ddl first. We do not need to know schema name, logical structure of source database where the dump file was exported from in prior.
<hr>
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black; margin-top: -2.5em;">
<code class="bash">
[oracle@oradr ~]$ impdp dumpfile=hr.dmp sqlfile=hr.sql directory=dump_dir

Import: Release 11.2.0.4.0 - Production on Mon Jun 18 03:33:21 2018

Copyright (c) 1982, 2011, Oracle and/or its affiliates.  All rights reserved.

Username: /as sysdba

Connected to: Oracle Database 11g Enterprise Edition Release 11.2.0.4.0 - 64bit Production
With the Partitioning, Oracle Label Security, OLAP, Data Mining,
Oracle Database Vault and Real Application Testing options
Master table "SYS"."SYS_SQL_FILE_FULL_01" successfully loaded/unloaded
Starting "SYS"."SYS_SQL_FILE_FULL_01":  /******** AS SYSDBA dumpfile=hr.dmp sqlfile=hr.sql directory=dump_dir 
Processing object type SCHEMA_EXPORT/USER
Processing object type SCHEMA_EXPORT/SYSTEM_GRANT
Processing object type SCHEMA_EXPORT/ROLE_GRANT
Processing object type SCHEMA_EXPORT/DEFAULT_ROLE
Processing object type SCHEMA_EXPORT/PRE_SCHEMA/PROCACT_SCHEMA
Processing object type SCHEMA_EXPORT/SEQUENCE/SEQUENCE
Processing object type SCHEMA_EXPORT/TABLE/TABLE
Processing object type SCHEMA_EXPORT/TABLE/GRANT/OWNER_GRANT/OBJECT_GRANT
Processing object type SCHEMA_EXPORT/TABLE/COMMENT
Processing object type SCHEMA_EXPORT/PROCEDURE/PROCEDURE
Processing object type SCHEMA_EXPORT/PROCEDURE/ALTER_PROCEDURE
Processing object type SCHEMA_EXPORT/TABLE/INDEX/INDEX
Processing object type SCHEMA_EXPORT/TABLE/CONSTRAINT/CONSTRAINT
Processing object type SCHEMA_EXPORT/TABLE/INDEX/STATISTICS/INDEX_STATISTICS
Processing object type SCHEMA_EXPORT/VIEW/VIEW
Processing object type SCHEMA_EXPORT/TABLE/CONSTRAINT/REF_CONSTRAINT
Processing object type SCHEMA_EXPORT/TABLE/TRIGGER
Processing object type SCHEMA_EXPORT/TABLE/STATISTICS/TABLE_STATISTICS
Job "SYS"."SYS_SQL_FILE_FULL_01" successfully completed at Mon Jun 18 03:33:29 2018 elapsed 0 00:00:03

[oracle@oradr ~]$ 
  </code>
</pre>

<hr>
Afer generating sql only, we will use some unix command like cat, grep and sort to find the schema name.
<hr>
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black; margin-top: -2.5em;">
<code class="bash">
[oracle@oradr ~]$ cat hr.sql | grep 'CREATE USER'
 CREATE USER "HR" IDENTIFIED BY VALUES 'S:891636E9E2A56E429380E30CBCF20B678EA0CCE21F41CC3C50F4693E9C8F;4C6D73C3E8B0F0DA'
[oracle@oradr ~]$ 
  </code>
</pre>
<hr>

After knowing the schema name then we will find what tablespace the schema uses.
<hr>
<pre style="overflow: auto; font-family: monospace; font-size: 0.8em; color: black; margin-top: -2.5em;">
	<code class="bash">
[oracle@oradr ~]$ cat hr.sql | grep TABLESPACE| sort -u
      DEFAULT TABLESPACE "USERS"
GRANT UNLIMITED TABLESPACE TO "HR";
  TABLESPACE "EXAMPLE" 
  TABLESPACE "EXAMPLE" ;
  TABLESPACE "EXAMPLE" PARALLEL 1 ;
      TEMPORARY TABLESPACE "TEMP";
[oracle@oradr ~]$ 
  </code>
</pre>

<table style="font-family: monospace; font-size: 0.8em; color: black;">
    <thead>
        <tr>
		<th>Export From Source Database With</th>
		<th colspan="6">
		      Use Export Data Pump parameter VERSION=... if dumpfile needs to be imported into a Target Database with compatibility level (value of init.ora/spfile parameter COMPATIBLE):
		  </th>
        </tr>
        <tr>
		<th>COMPATIBLE</th>
		<th>   10.1.0.x.y</th>
		<th>   10.2.0.x.y</th>
		<th>   11.1.0.x.y</th>
		<th>   11.2.0.x.y</th>
		<th>   12.1.0.x.y</th>
		<th>   12.2.0.x.y</th>
		</tr>
    </thead>
    <tbody>
<tr><td>10.1.0.x.y</td><td>            -</td><td>            -</td><td>            -</td><td>            -</td><td>            -</td><td>            -</td></tr>
<tr><td>10.2.0.x.y</td><td> VERSION=10.1</td><td>            -</td><td>            -</td><td>            -</td><td>            -</td><td>            -</td></tr>
<tr><td>11.1.0.x.y</td><td> VERSION=10.1</td><td> VERSION=10.2</td><td>            -</td><td>            -</td><td>            -</td><td>            -</td></tr>
<tr><td>11.2.0.x.y</td><td> VERSION=10.1</td><td> VERSION=10.2</td><td> VERSION=11.1</td><td>            -</td><td>            -</td><td>            -</td></tr>
<tr><td>12.1.0.x.y</td><td> VERSION=10.1</td><td> VERSION=10.2</td><td> VERSION=11.1</td><td> VERSION=11.2</td><td>            -</td><td>            -</td></tr>
<tr><td>12.2.0.x.y</td><td> VERSION=10.1</td><td> VERSION=10.2</td><td> VERSION=11.1</td><td> VERSION=11.2</td><td> VERSION=12.1</td><td>            -</td></tr>
    </tbody>
</table>


<style>

th {
	border-top: 1px solid #fff;
	color: #333;
	padding: 10px 15px;
	position: relative;
	text-shadow: 0 1px 0 #000;
	background-color: #eee;	
}

th:after {
	background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,.08));
	content: '';
	display: block;
	height: 25%;
	left: 0;
	margin: 1px 0 0 0;
	position: absolute;
	top: 25%;
	width: 100%;
}

td {
	border-right: 1px solid #fff;
	border-left: 1px solid #e8e8e8;
	border-top: 1px solid #fff;
	border-bottom: 1px solid #e8e8e8;
	padding: 5px 5px;
}

tr:nth-child(odd) td {
	background: #f1f1f1;	
}

tr:last-of-type td {
	box-shadow: inset 0 -1px 0 #fff; 
}

tr:last-of-type td:first-child {
	box-shadow: inset 1px -1px 0 #fff;
}	

tr:last-of-type td:last-child {
	box-shadow: inset -1px -1px 0 #fff;
}	
</style>






