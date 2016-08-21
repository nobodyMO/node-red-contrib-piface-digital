/**
 * Copyright 2013,2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var util = require("util");
    var PIFD = require('node-pifacedigital');

    // Map names of pins to Gordon's gpio PiFace pin numbers
    var pintable = {
        // Physical : WiringPi
        "PIN 1":0,
        "PIN 2":1,
        "PIN 3":2,
        "PIN 4":3,
        "PIN 5":4,
        "PIN 6":5,
        "PIN 7":6,
        "PIN 8":7
    }
	
	var hardwaretable = {
        "Address 0":0,
        "Address 1":1,
        "Address 2":2,
        "Address 3":3		
		
	}

	
    function PiFACEDigitalInNode(n) {
        RED.nodes.createNode(this,n);
        this.hardware = hardwaretable[n.hardware];        
		this.npin = n.pin;
        this.pin = pintable[n.pin];
        this.read = n.read || false;
        if (this.read) { this.buttonState = -2; }
        var node = this;
        if (node.pin>=0) {
           node.pi = new PIFD.PIFaceDigital(node.hardware,true); 
		   if (node.read)
		     {
			 node.val = node.pi.get(node.pin);   
		     var msg = {topic:"piface/"+node.npin, payload:node.val};
             node.send(msg);		     
			 }  
           		 
           var callback = function(pin,type){
             // Type will be 'lohi' or 'hilo'.
			 if (type=='lohi')
			   {
               node.val=1;				   
			   }
		      else
			   {
			   node.val=0;
		       }
			 node.status({fill:"green",shape:"dot",text:node.val});  
			 var msg = {topic:"piface/"+node.npin, payload:node.val};
             node.send(msg);
            };
           
		   node.pi.watch(node.pin,callback);			
           node.status({fill:"green",shape:"dot",text:node.val});
                                        
          }
        else 
		  {
          node.error("Invalid PiFACE pin: "+node.pin);
		  node.status({fill:"red",shape:"ring",text:"misconfigured"},true);
          }
        node.on("close", function() {
            node.pi.unwatch (node.pin);
        });
    }

    function PiFACEDigitalOutNode(n) {
        RED.nodes.createNode(this,n);
        this.hardware = hardwaretable[n.hardware];         
        this.pin = pintable[n.pin];
        this.set = n.set;
        this.level = n.level;
        var node = this;
        if (node.pin>=0) 
		  {
           node.pi = new PIFD.PIFaceDigital(node.hardware,true); 			
            if (node.set) 
			  {
              node.pi.set(node.pin,Number(node.level));             
              } 
            node.on("input", function(msg) {
                if (msg.payload === "true") { msg.payload = true; }
                if (msg.payload === "false") { msg.payload = false; }
                var out = Number(msg.payload);
                if ((out === 0)|(out === 1)) 
				  {
			      node.pi.set(node.pin,Number(out)); 
                  }
                else 
				  { 
			      node.warn("Invalid input - not 0 or 1"); 
				  }
            });
          }
        else 
		  {
            node.error("Invalid PiFACE pin: "+node.pin);
			node.status({fill:"red",shape:"ring",text:"misconfigured"},true);
        }
    }

        RED.nodes.registerType("rpi-piface-digital in",PiFACEDigitalInNode);
        RED.nodes.registerType("rpi-piface-digital out",PiFACEDigitalOutNode);
}
