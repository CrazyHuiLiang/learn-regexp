/*
    字符组
 */

/*
    字符组就是一组字符，在正则表达式中，表示在同一个位置可能出现的各种字符，其写法是在一对方括号 [ 和 ] 之间列出的所有可能出现的字符。
 */
describe('普通字符组', () => {

    test('3 in "0123456789"', () => {
        const result = /[3]/.test("123456789");
        expect(result).toBe(true);
    });

    /*
        使用范围表示法更直观,范围表示法的范围使用的是ASCII编码表
     */
    test('范围表示法', () => {
        const regexp = /^[0-9]$/; // 等价 /[0123456789]/
        expect(regexp.test('2')).toBeTruthy();
    });
    test('范围表示法2', () => {
        /*
            0-z 在ASCII中还包含了大写字母，这一点是比较奇怪的
         */
        const regexp = /^[0-z]$/;
        expect(regexp.test('A')).toBeTruthy();

        /*
            建议使用并列的写法，更直观
         */
        expect(/^[0-9a-zA-Z]$/.test('A')).toBeTruthy();
    });

    /*
        可以用转义序列 \xhex表示一个字符，其中\x是固定前缀，表示转义序列的开头,hex是对应的码值，是一个两位的16进制数值
        可以表现一些难以输入或者难以显示的字符，比如 \x7F
     */
    test('\\shax', () => {
        // A的码值是41(十进制65)
        const regexp = /^[\x41]$/;
        expect(regexp.test('A')).toBeTruthy();

        // 所有ASCII字符对应的字符组
        expect(/^[\x00-\x7F]$/.test('A')).toBeTruthy();
    });

    /*
        上面例子中的 - 不能匹配 -，而是用来表示范围，这类字符叫做元字符，如果需要使用其字符意义，而不是其作为元字符的意义时，就需要特殊处理
        -如果紧邻字符组的开方括号[,那么它就是普通字符，其他情况都是元字符，取消特殊含义的做法都是转义，在字符前加上反斜线字符\
     */
    test('元字符', () => {
        /*
            如果在字符组内部使用字符-，最好的办法是将它排列在字符组的开头
         */
        // 表示匹配-或者0-9
        expect(/^[-0-9]$/.test('-')).toBeTruthy();
        expect(/^[0-9\-]$/.test('-')).toBeTruthy();

        // TODO 未测试出意义
        // const regexp = new RegExp('[0-9\\-]');
        // console.log(regexp)
        // expect(regexp.test('-')).toBeTruthy();
    });

});

/*
    排除型字符组（Negated Character Class）非常类似普通字符组[...], 只是在开方括号[之后紧跟一个脱字符^,
    写作[^...],表示在当前位置，匹配一个没有列出的字符
 */
describe('排除型字符组', () => {
    test('A8', () => {
        // 第一个字符不可以是字符，第二个字符是字符
        expect(/^[^0-9][0-9]$/.test('A8')).toBeTruthy();

        /*
            排除型字符组是，在当前位置匹配一个没有列出的字符(必须匹配一个字符)，不是当前位置不要匹配列出的字符(不出现任何字符也可以)
            排除型字符组必须匹配一个字符
         */
        expect(/^[^0-9][0-9]$/.test('8')).toBeFalsy();

        /*
            在排除型字符组中，紧跟在^之后的-不是元字符
         */
        // 匹配一个-,0,9之外的字符
        expect(/^[^-09]$/.test('-')).toBeFalsy();
        expect(/^[^-09]$/.test('8')).toBeTruthy();

        /*
            在排除型字符组中，^是一个元字符，但只有它紧跟在[之后时才是元字符
            如果想表示字符组中可以出现^字符，不要让他紧挨着[即可，否则就要转义
         */
        // 匹配4个字符之一: 0^12
        expect(/^[0^12]$/.test('^')).toBeTruthy();
        expect(/^[\^012]$/.test('^')).toBeTruthy();
    });
});

/*
    长字符组简记法
    \d  数字，等价[0-9]
    \w  单词字符，等价[0-9a-zA-Z_]， \w 还能匹配下划线需要尤其注意
    \s  空白字符，等价[\t\r\n\v\f]

    字符组间记法可以单独出现，也可以使用在字符组中

    正则表达式也提供了 \d,\w,\s对应的排除型字符组的简记法
    \D 表示\d不能匹配的字符
    \W 表示\w不能匹配的字符
    \S 表示\s不能匹配的字符

    利用这种互补属性，可以有一些巧妙的效果，比如 [\s\S] 表示所有字符。
        许多语言中的正则表达式并没有直接提供"任意字符"的标识符（有些文档说：.能匹配任意字符，但默认情况下，点号其实不能匹配换行符），
        [\s\S]、[\w\W]、[\d\D] 看起来古怪，但确实可以匹配任意字符。

    \d,\w,\s的匹配规则，都是针对ASCII编码而言的，也叫ASCII编码规则，但目前一些语言中的表达式已经支持了Unicode字符

    不同语言可能有一些专属的独特的字符组间记法，比如Java8提供了
    \h 匹配任何水平方向的空白字符
    \v 匹配任何垂直方向的空白字符
 */
describe('字符组简记法', () => {
    test('\\d', () => {
        expect(/^\d$/.test('8')).toBeTruthy();
        expect(/^\d$/.test('a')).toBeFalsy();
    });

    test('\\w', () => {
        expect(/^\w$/.test('8')).toBeTruthy();
        expect(/^\w$/.test('a')).toBeTruthy();
        expect(/^\w$/.test('_')).toBeTruthy();
    });

    test('\\s', () => {
        expect(/^\s$/.test(' ')).toBeTruthy();
        expect(/^\s$/.test('\t')).toBeTruthy();
        expect(/^\s$/.test('\n')).toBeTruthy();
    });
});

// js 不支持
describe('字符组运算', () => {
    test('辅音字母', () => {
        expect(/^[[a-z]&&[^aeiou]]$/.test('m')).toBeTruthy();
    });
});

/*
    POSIX字符组： 一些类似 [:digit:], [:lower:] 的字符组简记法

    之前介绍的字符组都属于Perl衍生出来的正则表达式流派（Flavor），这个流派叫做PCRE（Per Compatible Regular Expression)

    正则还有其他流派，比如POSIX （Portable Operating System Interface for uniX），他是一系列规范，定义了UNIX操作系统应当支持的功能，
    其中也包括关于正则表达式的规范，常见的[a-z]形式的字符组，在POSIX规范中仍然获得了支持，他的准确名称是POSIX方括号表达式（POSIX bracket expression）
    主要用在UNIX/Linux系统中，与之前所说的字符组最主要的区别在于：
        在POSIX字符组中，反斜线\不是用来转义的，[\d]只能匹配\和d两个字符，而不是[0-9]对应的数字字符。
        为了解决字符串组中特殊意义转义问题，POSIX方括号表达式规定：如果在字符组中表达字符]，应当让它紧跟在字符组的开方括号之后，所以[]a] 能匹配的字符就是 ]或a
        如果在字符组中标识字符-,就必须将它放在字符组的闭方括号之前，[a-] 能匹配a或-

    POSIX字符组的意义会根据locale的变化而变化。

    PCRE字符组简记法可以脱离方括号直接出现，而POSIX字符组必须出现在方括号内。
 */
describe('POSIX字符组', () => {
    test('', () => {
        expect(/^[]$/.test('')).toBeTruthy();
    });
});
