(function() {
    var loadScript = function(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    };

    var generateN = function() {
        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
    };

    var getCookie = function(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }

    var isObject = function(obj) {
       return obj && (typeof obj  === "object");
    }

    var getMetaContentByName = function(metaValue, metaKey, content) {
        var metaKey = (metaKey==null) ? 'name' : metaKey;
        var content = (content==null) ? 'content' : content;
        var value = '';
        if (document.querySelector("meta["+metaKey+"='"+metaValue+"']")) {
            value = document.querySelector("meta["+metaKey+"='"+metaValue+"']").getAttribute(content).toString();
        }
        return value;
    }

    var serialize = function(obj) {
      var str = [];
      for(var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    }

    var deserialize = function(str) {
        var pairs = str.split('&');
        var result = {};
        pairs.forEach(function (pair) {
            pair = pair.split('=');
            var name = pair[0]
            var value = pair[1]
            if (name.length)
                if (result[name] !== undefined) {
                    if (!result[name].push) {
                        result[name] = [result[name]];
                    }
                    result[name].push(value || '');
                } else {
                    result[name] = value || '';
                }
        });
        return (result);
    }

    var removeEscapeString = function(str) {
        return str.replace(/[|&;:$%@"<>+?=']/g, "");
    }


    var mergeDict = function(destination, source) {
        for (var property in source) {
            if (source.hasOwnProperty(property)) {
                destination[property] = source[property];
            }
        }
        return destination;
    }

    window.StatAsync = function() {
        var self = this;
        this.version = '1.0.0';
        this.time = new Date();
        this.account = {
            "cross_storage_url": "http://p3.isanook.com/jo/0/mu/evt/_cross_storage/ex/hub.html",
            //"cross_storage_url": "http://music.sanook.com/h5/_cross_storage/ex/hub.html",
            // "cross_storage_url": "http://10.66.4.73/cross-storage/example/hub.html",

            "base_url": "http://isgstat.sanook.com",
            "app": "sanookStat",
            "campaign": "usersAct",

            //"base_url": "http://wmdstat.dev-sanook.com:8081",
            //"app": "sanookStatTest",
            //"campaign": "adsRectA",
            
            "referrer": document.referrer,
            "user_type": '',
            "user_id": '',
            "gender": '',
        }

        // # Here ...Edit params for each app, campaign
        this.params = {
            'u': this.account.user_type,
            'i': this.account.user_id,
            'r': encodeURIComponent(this.account.referrer),
            'c': document.domain,
            'ca': removeEscapeString(getMetaContentByName('SParse:category', 'name')),
            't': removeEscapeString(getMetaContentByName('SParse:keyword', 'name')),
            'ts': '',
            'g': this.account.gender,
        }

        this.getAccount = function () {
            return self.account;
        }

        this.getParams = function () {
            var _params = self.params;

            var userType = self.account.user_type;
            var userId = self.account.user_id;
            var timeSiteMilisec = new Date() - self.time;
            var timeSiteSeconds = Math.round(Math.abs(timeSiteMilisec / 1000));
            var gender = self.account.gender;

            _params.u = userType;
            _params.i = userId;
            _params.ts = timeSiteSeconds;
            _params.g = gender;
            return _params;
        }

        this.setUserId = function (_userId, _userType, _gender) {
            self.account.user_type = _userType;
            self.account.user_id = _userId;
            self.account.gender = _gender;
        }

        return {
            initialize: function (_app, _campaign) {
                self.account.app = _app;
                self.account.campaign = _campaign;
            },
            setUserId: this.setUserId,
            getAccount: this.getAccount,
            getParams: this.getParams
        };
    };


    if (typeof StatAsync != "undefined") {
        (function()
        {
            var _ = new StatAsync();

            StatAsync.init = function(_app, _campaign)
            {
                loadScript("http://p3.isanook.com/jo/0/mu/evt/survey/js/client.min.js", function() {
                //loadScript("http://music.sanook.com/h5/_file/client.min.js", function() {
                // loadScript("http://localhost/isg-stat-js/dist/client.min.js", function() {
                    _.initialize(_app, _campaign);

                    var appid = ''; // app_id (auth)
                    var uuid = '';  // local storage id (no auth on centralize) , cookie id (no auth on local client)
                    var uType = '';
                    var gender = '';

                    // // # Here ...Edit userId for each app, campaign
                    // var keyUID = 'uuid';
                    // if (typeof(Storage) !== "undefined") {
                    //     uuid = localStorage.getItem(keyUID);
                    //     if (!uuid) {
                    //         uuid = generateN() + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + generateN() + generateN();
                    //         localStorage.setItem(keyUID, uuid);
                    //     }
                    // } else {
                    //     // No Web Storage support..
                    //     uuid = getCookie(keyUID);
                    //     if (!uuid) {
                    //         uuid = generateN() + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + generateN() + generateN();
                    //         document.cookie = "uuid=" + uuid + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                    //     }
                    // }

                    // # Here ...Edit userId for each app, campaign
                    var account = _.getAccount();
                    var storage = new CrossStorageClient(account.cross_storage_url);

                    var keyUID = 'smiservice';
                    var oUser = getCookie(keyUID);
                    if (oUser) {
                        var smiservice = deserialize(oUser);
                        appid = smiservice['SMI_ID'];
                        gender = smiservice['GENDER'];
                        uType = '1';
                        // _.setUserId(uuid, uType, gender);

                    }
                    else {
                        //uuid = getCookie('uuid');
                        uType = '0';
                    }

                    storage.onConnect().then(function() {
                        return storage.get('uuid');
                    }).then(function(res) {
                        uuid = res;
                        if (!uuid) {
                            uuid = generateN() + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + generateN() + generateN();
                            //document.cookie = "uuid=" + uuid + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                            storage.onConnect().then(function() {
                                storage.set('uuid', uuid);
                            });
                        }
                        var new_id = appid + '{,}' + uuid;
                        _.setUserId(new_id, uType, gender);
                    }).catch(function(err) {
                        // Handle error -> get wmid or Local cookie instead
                        keyUID = 'wmid';
                        appid = getCookie(keyUID);
                        if (uuid) {
                            // #1 Get wmid
                            uType = '2';
                            gender = getCookie('sex');
                            var new_id = appid + '{,}' + uuid;
                            _.setUserId(new_id, uType, gender);
                        }
                        else {
                            // #2 Get local uuid
                            keyUID = 'uuid';
                            uuid = getCookie(keyUID);
                            if (!uuid) {
                                uuid = generateN() + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + generateN() + generateN();
                                document.cookie = "uuid=" + uuid + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                            }
                            uType = '99';
                            var new_id = appid + '{,}' + uuid;
                            _.setUserId(new_id, uType, gender);
                        }
                    });


                });
            }

            StatAsync.collectListener = function()
            {
                var myEvent = window.attachEvent || window.addEventListener;

                var isOnIOS = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i);
                var chkevent = isOnIOS ? "pagehide" : window.attachEvent ? 'onbeforeunload' : 'beforeunload';

                var isOnFacebook = navigator.userAgent.match(/\[FB/i);

                if (isOnFacebook) {
                    // If Facenook app browser => collect stat with 33 dec duration
                    var account = _.getAccount();
                    var _url = account.base_url + '/' + account.app + '/' + account.campaign;

                    var params = _.getParams();
                    params.ts = 33;

                    if (!params.i) {
                        //# defing guest local
                        var keyUID = 'uuid';
                        var uuid = getCookie(keyUID);
                        if (!uuid) {
                            uuid = generateN() + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + generateN() + generateN();
                            document.cookie = "uuid=" + uuid + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                        }
                        params.u = '99';
                        params.i = '{,}' + uuid;
                    }

                    var paramsStr = serialize(params);
                    var links = _url + '?' + paramsStr;

                    if (navigator.sendBeacon) {
                        navigator.sendBeacon(links, null);
                    }
                    else {
                        var xhr;
                        if (window.XMLHttpRequest) {
                            xhr = new XMLHttpRequest();
                        }
                        else {
                            xhr = new ActiveXObject("Microsoft.XMLHTTP");
                        }

                        xhr.open("GET", links, false);
                        xhr.onload = function () {
                            console.log(xhr.responseText);
                        };
                        xhr.send(null);
                    }
                }
                else {
                    // Other => onbeforunload event
                    myEvent(chkevent, function(e) {
                        var confirmationMessage = "\o/";

                        var account = _.getAccount();
                        var _url = account.base_url + '/' + account.app + '/' + account.campaign;

                        var params = _.getParams();
                        if (!params.i) {
                            //# defing guest local
                            var keyUID = 'uuid';
                            var uuid = getCookie(keyUID);
                            if (!uuid) {
                                uuid = generateN() + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + generateN() + generateN();
                                document.cookie = "uuid=" + uuid + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                            }
                            params.u = '99';
                            params.i = '{,}' + uuid;
                        }

                        var paramsStr = serialize(params);
                        var links = _url + '?' + paramsStr;

                        if (navigator.sendBeacon) {
                            navigator.sendBeacon(links, null);
                        }
                        else {
                            var xhr;
                            if (window.XMLHttpRequest) {
                                xhr = new XMLHttpRequest();
                            }
                            else {
                                xhr = new ActiveXObject("Microsoft.XMLHTTP");
                            }

                            xhr.open("GET", links, false);
                            xhr.onload = function () {
                                console.log(xhr.responseText);
                            };
                            xhr.send(null);
                        }

                        // (e || window.event).returnValue = confirmationMessage;
                        // console.log(links);
                        // return confirmationMessage;
                        // return null;
                        return;
                    });
                }

            }

            StatAsync.collectEvent = function(_app, _event, _opt_dict)
            {
                if (isObject(_opt_dict)) {
                    var account = _.getAccount();
                    var _url = account.base_url + '/' + _app + '/' + _event;

                    var params = _.getParams();
                    mergeDict(_opt_dict, params);

                    if (!params.i) {
                        //# defing guest local
                        var keyUID = 'uuid';
                        var uuid = getCookie(keyUID);
                        if (!uuid) {
                            uuid = generateN() + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + '-' + generateN() + generateN() + generateN();
                            document.cookie = "uuid=" + uuid + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                        }
                        _opt_dict.u = '99';
                        _opt_dict.i = '{,}' + uuid;
                    }

                    var paramsStr = serialize(_opt_dict);
                    var links = _url + '?' + paramsStr;

                    if (navigator.sendBeacon) {
                        navigator.sendBeacon(links, null);
                    } 
                    else {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", links, true);
                        xhr.onload = function () {
                            console.log(xhr.responseText);
                        };
                        xhr.send();
                    }
                }
                
                return false;
            }

            StatAsync.getAccount = function() {
                return _.getAccount();
            }
            
        })();
    }
})(window, document);

