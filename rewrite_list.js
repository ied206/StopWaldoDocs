class RewriteTarget {
    constructor(name, regExp, replaceStr) {
        this.name = name;
        this.regExp = regExp;
        this.replaceStr = replaceStr;
    }

    testUrl(url) {
        return this.regExp.test(url);
    }

    convertUrl(url) {
        return url.replace(this.regExp, this.replaceStr);
    }

    tryConvertUrl(url) {
        if (this.testUrl(url) === true)
            return this.convertUrl(url);
        else
            return null;
    }
}

var sites = [
    new RewriteTarget("ms-docs", new RegExp("^(http(?:s|):\\/\\/docs.microsoft.com\\/)(ko-kr)", "i"), "$1en-US"),
]