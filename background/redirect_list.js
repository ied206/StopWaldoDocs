"use strict";

class RedirectInfo {
    constructor(name, regExp, replaceStr, conditions) {
        this.name = name; // string
        this.regExp = regExp; // RegExp
        this.replaceStr = replaceStr; // string
        this.conditions = conditions; // array of dict
    }
}

var sites = [
    new RedirectInfo(
        "ms-docs", 
        new RegExp("^(http(?:s|):\\/\\/docs.microsoft.com\\/)(ko-kr)", "i"), 
        "$1en-US",
        [
            {
                query: "meta[name='ms.translationtype']",
                attribute: "content",
                expected: "MT",
            },
        ]
    ),
];

