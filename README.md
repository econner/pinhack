pinhack
=======

Local Setup
-----------

Install python environment

	virtualenv pinhack_env
	source pinhack_env/bin/activate
	pip install -r requirements.txt

Get your public key on the server in deploy's authorized_keys by talking to Eric.

Modify your ``.git/config`` file to look like this:

	[core]
		repositoryformatversion = 0
		filemode = true
		bare = false
		logallrefupdates = true
		ignorecase = true
	[remote "origin"]
		fetch = +refs/heads/*:refs/remotes/origin/*
		url = https://github.com/econner/pinhack.git
	[branch "master"]
		remote = origin
		merge = refs/heads/master
	[remote "web"]
		url = ssh://deploy@ec2-54-235-213-135.compute-1.amazonaws.com:22/home/deploy/pinhack.git
		fetch = +refs/heads/*:refs/remotes/web/*

The remote "web" allows you to push directly to the server we have running at
``deploy@ec2-54-235-213-135.compute-1.amazonaws.com``.

Install Redis:

	curl -O http://redis.googlecode.com/files/redis-2.6.8.tar.gz
	tar xzf redis-2.6.8.tar.gz
	cd redis-2.6.8
	make

Copy over redis init scripts:

	sudo cp src/redis-server /usr/local/bin/
	sudo cp src/redis-cli /usr/local/bin/

Remote Setup
------------
TODO
