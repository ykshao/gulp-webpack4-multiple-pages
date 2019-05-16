// 第四版
Function.prototype.bind2 = function (context) {

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    function fNOP() {};
    fNOP.prototype = this.prototype;
    
    function fBound() {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }
    fBound.prototype = new fNOP();
    
    return fBound;
}