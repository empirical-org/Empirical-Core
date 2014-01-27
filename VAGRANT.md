# Setup Quill with Vagrant

Requirements
------------
* Install [VirtualBox](https://www.virtualbox.org/).
* Install [Vagrant](http://vagrantup.com).
* Install the [Vagrant Berkshelf Plugin](https://github.com/berkshelf/vagrant-berkshelf).

Creating a new virtual machine
------------------------------

From the Quill project directory run the following command:

`$ vagrant up`

If this is your first time running this command, this will take nearly 30 minutes. It has to download a base installation of Ubuntu and set up and build all of the requirements for Quill.

Using your new virtual machine
------------------------------

Login to your new virtual machine!

`$ vagrant ssh`

This will log you into your virtual machine as if you connected to it via ssh.

Run Quill
---------

The Quill project directory will automatically be mounted as `/vagrant` on your new virtual machine. To run Quill, run the following commands:

    $ cd /vagrant
    $ rails server

Visit `http://localhost:3000` on your host machine and Quill will be running! All changes that you make to the Quill files will be automatically updated in the virtual machine.

Stopping the virtual machine
----------------------------

You probably don't want to have this virtual machine running all the time. When you are not working on Quill, run `vagrant down` to stop the virtual machine. To get everything started again, just run `vagrant up` from the Quill project directory and everything will be where you left off.
