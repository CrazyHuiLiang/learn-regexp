/*
    如果一个表达式用括号包围起来，括号里的表达式通常被称为"子表达式(sub-expression)"

    如果用量词限定出现次数的元素不是字符或字符组，而是连续的几个字符甚至表达式，就应该用括号将他们"编为一组"，括号的这种功能叫做分组（grouping)
 */
describe('id card number', () => {
// 匹配身份证号码：是一个15或18个字符的字符串
    // 15位
        // 全部由数字组成
        // 首位是数字，不能为0  [1-9]
    // 18位
        // 前17位全部是数字，首位不为0
        // 末位可能是数字，也可能是字母x
    // 总体来说
        // 首位是数字，不能为0  [1-9]
        // 除去首末2位，剩下13位或16位，都是数字    \d{13,16}
        // 末位可能是数字，也可能是x    [0-9x]
    test('use character class and quantifier', () => {
        const regexp = /[1-9]\d{13,16}[0-9x]/;
        expect(regexp.test('110101198001017032')).toBeTruthy();
        expect(regexp.test('11010119800101703x')).toBeTruthy();
        expect(regexp.test('110101800101702')).toBeTruthy();

        // 错误的匹配示例
        expect(regexp.test('1101018001017021')).toBeTruthy(); // 16位
        expect(regexp.test('11010180010170211')).toBeTruthy(); // 17位
        expect(regexp.test('11010180010170x')).toBeTruthy(); // 15位的身份证号不可x结尾
    });
    // 15位身份证号码     [1-9]\d{14}
    // 18位身份证号码     [1-9]\d{14}\d{2}[0-9x]
    test('use grouping', () => {
        const idCardRegExp = /^[1-9]\d{14}(\d{2}[0-9x])?$/

        expect(idCardRegExp.test('110101198001017032')).toBeTruthy();
        expect(idCardRegExp.test('11010119800101703x')).toBeTruthy();
        expect(idCardRegExp.test('110101800101702')).toBeTruthy();
        // expect(/^[]$/.test('')).toBeTruthy();

        expect(idCardRegExp.test('1101018001017021')).toBeFalsy(); // 16位
        expect(idCardRegExp.test('11010180010170211')).toBeFalsy(); // 17位
        expect(idCardRegExp.test('11010180010170x')).toBeFalsy(); // 15位的身份证号不可x结尾
    });
});

// 准确匹配 open tag
    // <[^/][^>]*>          也会匹配self-closing tag
    // <[^/][^>]*[^/]>      可避免self-closing tag的匹配，但因为两个排除字符组要匹配两个字符，这个表达式又会漏过<u>之类的open tag
    // <[^/]([^>]*[^/])?>   用一个括号将可选出现的部分分组，再用量词?限定，可以兼顾上面两种情况准确，匹配open tag
describe('open tag', () => {
    test('exactly match', () => {
        const regExp = /^<[^/]([^>]*[^/])?>$/;
        expect(regExp.test('<u>')).toBeTruthy();
        expect(regExp.test('<table>')).toBeTruthy();
        expect(regExp.test('<u/>')).toBeFalsy();
        expect(regExp.test('</table>')).toBeFalsy();
    });
});

// 完整匹配E-mail地址
describe('email', () => {
    // E-mail地址以@分隔为两段，@之前的为用户名，之后的为主机名
        // 用户名 只允许数字、字母、下划线、. ; 简写为 [\w.]，最大长度是64个字符
            // [\w.]{1,64}
        // 主机名 是以.分隔的多个段，最少需要一个段（顶级端），每个段的长度最大为63个字符
            // ([-a-zA-Z0-9]{1,63}\.)*[-a-zA-Z0-9]{1,63}
    test('exactly match', () => {
        const regExp = /^[-\w.]{1,64}@([-a-zA-Z0-9]{1,63}\.)*[-a-zA-Z0-9]{1,63}$/;
        expect(regExp.test('abc@somehost')).toBeTruthy();
        expect(regExp.test('abc@somehost.com')).toBeTruthy();
        expect(regExp.test('abc@some-host.com')).toBeTruthy();
        expect(regExp.test('abc@sub.some-host.com')).toBeTruthy();

        expect(regExp.test('abc@.somehost.com')).toBeFalsy();
        expect(regExp.test('a#bc@somehost.com')).toBeFalsy();
    });
});

/*
    多选结构
        形式是(...|...)，在括号内以竖线|分隔开多个子表达式，这些子表达式也叫多选分支；
        在一个多选结构内，多选分支的数目没有限制。
        在匹配时，整个多选结构被视为单个元素，只要其中某个子表达式能够匹配，整个多选结构的匹配就能成功
        如果所有的子表达式都不能匹配，则整个多选结构匹配失败
 */
describe('alternative', () => {

    test('id card', () => {
        const idCardRegExp = /^([1-9]\d{14}|[1-9]\d{16}[0-9x])$/

        expect(idCardRegExp.test('110101198001017032')).toBeTruthy();
        expect(idCardRegExp.test('11010119800101703x')).toBeTruthy();
        expect(idCardRegExp.test('110101800101702')).toBeTruthy();
        // expect(/^[]$/.test('')).toBeTruthy();

        expect(idCardRegExp.test('1101018001017021')).toBeFalsy(); // 16位
        expect(idCardRegExp.test('11010180010170211')).toBeFalsy(); // 17位
        expect(idCardRegExp.test('11010180010170x')).toBeFalsy(); // 15位的身份证号不可x结尾
    });

    // ip 地址由4个点分十进制组成，每段的取值范围为 [0,255]
        // 每段的数字
            // 如果是1位数，那么对数字没有限制  [0-9]
            // 如果是2位数，那么对数字没有限制  [0-9]{2}
            // 如果是3位数
                // 如果第1位是1，那么第2，3位数字没有限制  1[0-9][0-9]
                // 如果第1位是2
                    // 如果第2位数字是0-4，那么第3位数字没有限制  2[0-4][0-9]
                    // 如果第2位数字是5,那么第3位数字只能是 0-5  25[0-5]
    test('0~255', () => {
        // 用正则表达式表示 0-255
        const regExp = /^([0-9]|[0-9]{2}|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/;
        expect(regExp.test('0')).toBeTruthy();
        expect(regExp.test('98')).toBeTruthy();
        expect(regExp.test('168')).toBeTruthy();
        expect(regExp.test('256')).toBeFalsy();
    });

    /*
        在多选结构中一般会同时使用括号()和竖线|;但是如果没有括号，只出现竖线，仍然是多选结构
        在多选结构中，竖线|用来分割多选结构，而括号()用来规定整个多选结构的范围，如果没有出现括号，则整个表达式视为一个多选结构
     */
    test('alternative without bracket', () => {
        expect(/ab|cd/.test('ab')).toBeTruthy();
        expect(/ab|cd/.test('cd')).toBeTruthy();

        /*
            推荐在使用多选结构是使用括号，可以规避一些错误，因为竖线|的优先级很低
                ^ab|cd$ 其实是 (^ab|cd$) 而不是 ^(ab|cd)$，其含义是ab开头的字符串，或者cd结尾的字符串，而不是只包含ab或cd的字符串
         */
        expect(/^ab|cd$/.test('abc')).toBeTruthy();
        expect(/^ab|cd$/.test('bcd')).toBeTruthy();
        expect(/^(ab|cd)$/.test('abc')).toBeFalsy();
        expect(/^(ab|cd)$/.test('bcd')).toBeFalsy();
    });
    /*
        多选分支的排列是有讲究的，在java,python,javaScript语言中，多选结构都会优先选择最左侧的分支

        在平时使用中，如果出现多选结构，应当尽量避免多选分支中存在重复匹配，因为这样会大大增加回溯的计算量。
     */
    test('alternative order', () => {
        expect(/(jeffrey|jeff)/.exec('jeffrey')).toContain('jeffrey');
        expect(/(jeff|jeffrey)/.exec('jeffrey')).toContain('jeff');
    });
});
