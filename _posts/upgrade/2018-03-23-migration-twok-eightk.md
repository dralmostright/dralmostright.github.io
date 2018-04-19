---
layout:	upgrade
title:	"Migration of database with 2k block size to 8k"
date:	2018-03-23 10:36:23
category: upgrade
metadata: "I am meta data"
---
<span class="image featured"><img src="/images/2k-8k-mig-banner.png" alt=""></span>

	
<header>
		<h3>A detailed note/hands on for changing database bock size parameter.</h3>
</header>


The parameter **DB_BLOCK_SIZE** is one of the critical and important factor to considered during database creation. As This parameter can be set and changed once and only during creation of database. The incorrect choice of this parameter may lead to unnecessary performance burden on database server. Starting Oracle 9i release, each tablespace can have a different block size with a mandatory separate cache memory(i.e. defined by setting parameter DB_nK_CACHE_SIZE), thus giving a relief for criticality for choice of database block-size. But the point we just discussed is just a relief it's not truly a solution. Hence a database must be rebuild to change the DB_BLOCK_SIZE parameter. The larger value for DB_BLOCK_SIZE results less I/O as more data resides in a single block but consumes more memory, in contrast smaller value lets to withdraw single records faster and saves memory. The choice of **DB_BLOCK_SIZE** parameters vary from environment to environment but must commonly used value is 8k.

Now lets us consider we have a database with db_blcok_size 2k and we are facing unnecessary performance issues and we decided to change our 2k to 8k. So what are the viable options we can choose to carry out this task with less downtime.

We can accomplish this task using Oracle Golden Gate, Materialized vies and Transportable Tablespace.

In this article we will be focusing the method using Transportable Tablespace in conjunction with DBMS_REDEFINITION feature. We will go with enumerating each step, with code snippets and details.

In nutshell our plan will be creating a new Database with in the same server (let's call it as destination database) with 8k block size. Create new 8k tablespaces within 2k database (let's call it as source database). Then migrate all the objects from 2k tablespace (of source database) to 8k tablespaces (of source database) using DBMS_REDEFINITION. With successful of that will export application schema metadata without table and import to destination 8k database (destination). Finally export 8k tablespace and import 8k tablespaces in the 8k database.

Before getting our hands dirty, first lets describe our environment.

<ul style="list-style-type:disc; margin-left: 2em">
<li>Our host environment is OEL 6.4</li>
<li>Our database version is 11.2.0.4</li>
<li>No Advanced Security Options are enabled</li>
<li>Database Server Edition is Enterprise Edition</li>
<li>Application User in database is one and only HR</li>
</ul>

<span>
	<strong>Step: 1</strong>
	<br />
</span>
As a first step it's good to be ensure that valid full backup of database and it not found its most recommend to have one.

<span>
	<strong>Step: 2</strong>
	<br />
</span>
A new database instance with 8k block size is created in same server with **identical character sets**.

<span>
	<strong>Step: 3</strong>
	<br />
</span>
All application specific schemas are listed with consulting application team and tablespaces that holding application schema data are identified. With identification of schema and tablespaces the respective tablespaces with 8k block size are created with extension 8k i.e if tablespace name is users, the 8k block size tablespace are created as users8k. Before creating 8k tablespaces we need to set db_8k_cache_size parameter otherwise we will get ORA-29339 signaled during:  while creating tablespaces with 8k block size. As the database has only one application user HR and only one tablespace user we will only create user8k tablespace with 8k block size.

<span class="image featured"><img src="/images/upgrade/upgrade1.png" alt=""></span>

<span>
	<strong>Step: 4</strong>
	<br />
</span>
Our next step will be copying only structure of all application tables to newly created 8k tablespaces with 8k extension i.e if there is employee there with be respective table name employee8k table in 8k tablespace. We will user script to perform this task and link to the script will be given below at end of step. The script will automatically generate scripts to move tables from 2k to respective 8k tablespaces and execute also.

With execution of script copytableDef.sh it generates two file as shown in snapshots for verification.
<span class="image featured"><img src="/images/upgrade/upgrade2.png" alt=""></span>

With execution of script copytableDef.sh new tables are created in respective 8k tablespaces. 
<span class="image featured"><img src="/images/upgrade/upgrade3.png" alt=""></span>

Please refer to link [copytableDef.sh](https://github.com/dralmostright/2k-8k-migration/blob/master/copytableDef.sh) for scripts.

<span>
	<strong>Step: 5</strong>
	<br />
</span>
The table redefinition prerequisite is checked and verified using DBMS_REDEFINITION.Please refer to Oracle documentation page to read about [DBMS_REDEFINITION](https://docs.oracle.com/cd/B28359_01/appdev.111/b28419/d_redefi.htm). The verification is done by using script mig2K-8K.sh and it can be download from [github](https://github.com/dralmostright/2k-8k-migration/blob/master/mig2K-8K.sh). The verification of script can be done by checking respective log files as in snapshots.

<span class="image featured"><img src="/images/upgrade/upgrade4.png" alt=""></span>

<span>
	<strong>Step: 6</strong>
	<br />
</span>
Now verifying the redefinition status we can now redefine application tables residing to 2k tablespaces to respective tables \*8k residing on 8k tablespaces and sync. We will also be using script here to perform the task. The script [startReDef.sh](https://github.com/dralmostright/2k-8k-migration/blob/master/startReDef.sh) does the following tasks for each application tables:

<ul style="list-style-type:disc; margin-left: 2em">
<li>start redefining table using ROW_ID</li>
<li>copy all dependent objects related to table and report if any errors</li>
<li>with successful redefinition and copying data final sync the data between source and target tables</li>
<li>drop the interim *8k table</li>
<li>purge the recycle bin</li>
<li>rebuild all indexes online</li>
</ul>

First let's capture where the currently the objects are as in snapshot below:
<span class="image featured"><img src="/images/upgrade/upgrade5.png" alt=""></span>
Then lets execute the [startReDef.sh](https://github.com/dralmostright/2k-8k-migration/blob/master/startReDef.sh) script and view the log files.
<span class="image featured"><img src="/images/upgrade/upgrade6.png" alt=""></span>
At last let's verify the once again.
<span class="image featured"><img src="/images/upgrade/upgrade7.png" alt=""></span>

<span>
	<strong>Step: 7</strong>
	<br />
</span>
We will export the application specific metadata excluding tables for application schemas using expdp in script [expAppSchema.sh](https://github.com/dralmostright/2k-8k-migration/blob/master/expAppSchema.sh).
<span class="image featured"><img src="/images/upgrade/upgrade10.png" alt=""></span>
Creating application schema user in destination db instance with 8k block size.
<span class="image featured"><img src="/images/upgrade/upgrade11.png" alt=""></span>
Now let's import the metadata to the destination instance with 8k block size using script [impAppSchema.sh](https://github.com/dralmostright/2k-8k-migration/blob/master/impAppSchema.sh).
<span class="image featured"><img src="/images/upgrade/upgrade12.png" alt=""></span>
The warnings can be ignored and will be resolved after compilation after import of transportable tablespae.

Now let's verity the import of objects in in destination instance.
<span class="image featured"><img src="/images/upgrade/upgrade13.png" alt=""></span>


<span>
	<strong>Step: 8</strong>
	<br />
</span>
Now the system outage starts. In this step we will export meta data of the application specific schema excluding tables again we will perform this with script [expdpTTS.sh](https://github.com/dralmostright/2k-8k-migration/blob/master/expdpTTS.sh), which will perform following tasks:

<ul style="list-style-type:disc; margin-left: 2em">
<li>Automatically select 8k block size tablespaces holding application application schema data</li>
<li>Change the status of selected tablespaces to read only status</li>
<li>Generate expdp script for transportable space</li>
<li>Run the generated script and take expdp for TTS</li>
</ul>

Let's run the [expdpTTS.sh](https://github.com/dralmostright/2k-8k-migration/blob/master/expdpTTS.sh)
<span class="image featured"><img src="/images/upgrade/upgrade8.png" alt=""></span>
Also verify the tablespace status.
<span class="image featured"><img src="/images/upgrade/upgrade9.png" alt=""></span>

<span>
	<strong>Step: 9</strong>
	<br />
</span>
In this step we will perform plug all Transported tablespace to database with 8k block size using script [impdpTTS.sh](https://github.com/dralmostright/2k-8k-migration/blob/master/impdpTTS.sh), which will perform following tasks:
<ul style="list-style-type:disc; margin-left: 2em">
<li>Generate transportable tablespace script</li>
<li>Shutdown the source database instance i.e db with block size 2k</li>
<li>Run the transportable tablespace script against 8k block size database</li>
<li>Verify the import and data in destination 8k block size</li>
</ul>

Let's run the script [impdpTTS.sh](https://github.com/dralmostright/2k-8k-migration/blob/master/impdpTTS.sh) and verify its output.
<span class="image featured"><img src="/images/upgrade/upgrade14.png" alt=""></span>

View objects in destination database instance i.e. db with block size 8k.
<span class="image featured"><img src="/images/upgrade/upgrade15.png" alt=""></span>

Verify the tablespace status in destination database instance i.e. db with block size 8k.
<span class="image featured"><img src="/images/upgrade/upgrade16.png" alt=""></span>

Verify the objects status in destination database instance i.e. db with block size 8k.
<span class="image featured"><img src="/images/upgrade/upgrade17.png" alt=""></span>

If any invalid objects lets compile all inavlid objects with utlrp.sql
<span class="image featured"><img src="/images/upgrade/upgrade18.png" alt=""></span>

Finally let's verify the objects status.
<span class="image featured"><img src="/images/upgrade/upgrade19.png" alt=""></span>

Hmm now it's done. :-) .

You can get all the source codes of scripts used in Github repository [2k-8k-migration](https://github.com/dralmostright/2k-8k-migration)

<hr >
<hr >
<br />
<br />
<style>
	.image.featured{
		display: inline;
	}
</style>
