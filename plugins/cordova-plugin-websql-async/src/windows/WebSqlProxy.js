﻿/*
 * Copyright (c) Microsoft Open Technologies, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 */

module.exports = {
    db: null,

    open: function (success, fail, args) {
        try {
            this.db = args[0];
            success();
        } catch(ex) {
            fail(ex);
        }
    },

    close: function (success, fail, args) {
        try {
            this.db = null;
            success();
        } catch (ex) {
            fail(ex);
        }
    },

    executeSql: function (success, fail, args) {
        try {
            var connectionId = args.shift();
            var promise = SQLitePluginNative.SQLiteProxy.executeSql(connectionId, args);
            promise.then(function(res) {
                res = JSON.parse(res);

                // You can't access the original message text from JavaScript code.
                // http://msdn.microsoft.com/en-US/library/windows/apps/br230301.aspx#ThrowingExceptions
                // so we return it via custom object
                if (res && res.message) {
                    fail(res);
                    return;
                }

                success(res);
            });
        } catch(ex) {
            fail(ex);
        }
    },

    connect: function(success, fail, args) {
        try {
            var dbName = args.shift();
            this.db = dbName;

            var res = SQLitePluginNative.SQLiteProxy.connect(dbName);
            res = JSON.parse(res);

            if (res && res.message) {
                fail(res);
                return;
            }

            success(res);
        } catch (ex) {
            fail(ex);
        }
    },

    disconnect: function(success, fail, connectionId) {
        try {
            var res = SQLitePluginNative.SQLiteProxy.disconnect(connectionId.shift());
            res = JSON.parse(res);

            if (res && res.message) {
                fail(res);
                return;
            }

            success();
        } catch (ex) {
            fail(ex);
        }
    }
};
require("cordova/exec/proxy").add("WebSql", module.exports);
