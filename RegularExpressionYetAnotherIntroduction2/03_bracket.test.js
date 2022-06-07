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

/*
    引用分组
        使用括号之后，正则表达式会保存每个分组真正匹配的文本，等到匹配完成后
            在JavaScript中，exec 执行后返回，返回一个类数组结构的匹配对象（matcher），通过 matcher[num]可以取得捕获的内容
            在Python中通过 group(num)之类的方法"引用"分组在匹配时捕获的内容。
        其中，num表示对应括号的编号，括号分组的编号规则是从左向右计数，从1开始。（在JavaScript中下标0默认是整个被匹配的字符串）
        因为捕获了文本，所以这种功能叫作捕获分组(capturing group)
 */
describe("capturing group", () => {
    test('date', () => {
        let regExp = /(\d{4})-(\d{2})-(\d{2})/;
        const matcher = regExp.exec('2022-05-16');
        // console.log(matcher);
        expect(matcher[1]).toBe('2022');
        expect(matcher[2]).toBe('05');
        expect(matcher[3]).toBe('16');
    });
    /*
        当出现嵌套括号时，无论括号如何嵌套，分组的编号都是根据开括号出现顺序来计数的；
        开括号是从左向右起第几个开括号，整个括号分组的编号就是多少
     */
    test('nesting group', () => {
        let regExp = /(((\d{4})-(\d{2}))-(\d{2}))/;
        const matcher = regExp.exec('2022-05-16');
        // console.log(matcher);
        expect(matcher[1]).toBe('2022-05-16');
        expect(matcher[2]).toBe('2022-05');
        expect(matcher[3]).toBe('2022');
        expect(matcher[4]).toBe('05');
        expect(matcher[5]).toBe('16');
    });

    // 捕获超链接的链接和文本
    test('hyperlink', () => {
        const regExp = /<a\s+href\s*=\s*["']?([^"'\s]+)["']?>([^<]+)<\/a>/;
        const string = `<a href="http://localhost">localhost</a>`;
        const matcher = regExp.exec(string);
        // console.log(matcher);
        expect(matcher[1]).toBe('http://localhost');
        expect(matcher[2]).toBe('localhost');
    });
    // 捕获img的src
    test('img', () => {
        const regExp = /<img\s+[^>]*?src\s*=\s*["']?([^"'\s]+)["']?[^>]*\/?>/;
        const string = `<img width="700" height="700" src="http://localhost" alt="test" />`;
        const matcher = regExp.exec(string);
        // console.log(matcher);
        expect(matcher[1]).toBe('http://localhost');
    });

    /*
        引用分组捕获的文本，不仅仅用于数据提取，也可以用于替换
        在JavaScript中，string具有replace方法，如果在替换的replacement字符串中引用捕获分组，则应当使用 $num 记法
        replacement并不是一个正则表达式，而是一个普通字符串。
     */
    // 将 YYYY-MM-DD 替换为 YYYY/MM/DD
    test('replacement', () => {
        const date = `2022-05-16`.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3');
        // console.log(date);
        expect(date).toBe('2022/05/16');
    });
});

/*
    反向引用（back-reference）：它允许在正则表达式内部引用之前捕获分组匹配的文本（也就是左侧），其形式是 \num,其中num表示所引用分组的编号
 */
describe('back-reference', () => {
    // 用反向引用匹配叠词
    test('repeat char', () => {
        const regexp = /^([a-z])\1$/;
        expect(regexp.test('aa')).toBeTruthy();
        expect(regexp.test('bb')).toBeTruthy();
        expect(regexp.test('ab')).toBeFalsy();
    });

    // 用反向引用匹配成对的tag
    test('open tag and close tag', () => {
        const regexp = /<([^>]+)\s?[^>]*>[\s\S]*?<\/\1>/;
        expect(regexp.test('<bold>test</bold>')).toBeTruthy();
        expect(regexp.test('<div>test</div>')).toBeTruthy();
        expect(regexp.test('<div class="wrapper">test</div>')).toBeTruthy();

        expect(regexp.test('<bold>test></div>')).toBeFalsy();
    });

    /*
        反向引用重复的是对应捕获分组匹配的文本，而不是之前的表达式；
        也就是说，反向引用是一种"引用"，对应的是之前表达式决定的具体文本，它本身并不规定文本特征。
     */
    test('ip', () => {
        // 匹配ip地址的表达式应该将[0~255]的表达式进行重复，而不是使用反向引用

        const rang0_255 = "(0{0,2}[0-9]|0?[0-9]{2}|1[0-9][0-9]|2[0-4][0-9]|25[0-5])"
        const regexp = new RegExp(`^(${rang0_255}.){3}${rang0_255}$`);
        // console.log(regexp.toString());
        expect(regexp.test('8.8.8.8')).toBeTruthy();
    });
});

/*
    反向引用， 对于\后有两位数字的情况，类似 \10 匹配的是第十个匹配分组还是 第一个分组+0？ 这个问题在不同语言中的实现是略有不同的
    在JavaScript中，实测如果不存在10个分组， \10 会导致表达式匹配不到任何内容
 */
describe('capture conflict', () => {
    const regexp = /^(\w)(\w)(\w)(\w)(\w)(\w)(\w)(\w)(\w)(\w)(\10)$/g;
    expect(regexp.exec('123456789aa')[11]).toBe('a');

    const regexp2 = /^(\w)(\w)(\w)(\w)(\w)(\w)(\w)(\w)(\w)(\10)$/g;
    expect(regexp2.exec('123456789')).toBeInstanceOf(Array);
    expect(regexp2.exec('123456789aa')).toBeNull();
});

/*
    命名分组：通过数字编号的普通分组不够直观，多了难免混淆，引用时也不够方便，针对于 \10 的情况还有混淆的问题
    为了解决这类问题，一些语言提供了命名分组(named grouping)，可以将它看作另一种捕获分组，但是标识是容易记忆和辨别的名字，而不是数字编号
        不同的语言中针对命名分组所提供的记法会有差别。

    ES2017的JavaScript才支持使用命名分组
 */
describe('named grouping', () => {
    /*
        JavaScript使用 (?<name>) 作为分组记法
     */
    test('match', () => {
        const regexp = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
        const matcher = regexp.exec('2022-05-17');
        expect(matcher.groups.year).toBe('2022');
        expect(matcher.groups.month).toBe('05');
        expect(matcher.groups.day).toBe('17');
        // console.log(matcher);
    });
    /*
        JavaScript使用 \k<name> 作为表达式中的引用记法
     */
    test('back-reference', () => {
        const regexp = /^(?<char>[a-z])(\k<char>)$/;
        expect(regexp.test('aa')).toBeTruthy();
        expect(regexp.test('ab')).toBeFalsy();
    });
    /*
        JavaScript使用 $<name> 作为替换时的引用记法
     */
    test('replace', () => {
        const regexp = /(?<digit>\d)/g;
        expect('123'.replace(regexp, '$<digit>,')).toBe('1,2,3,');
    });
});

/*
    无论是否需要引用分组，只要出现了括号，正则表达式在匹配时就会把括号内的子表达式存储起来，提供引用。
    如果不需要引用，保存这些信息无疑会影响正则表达式的性能；

    为了解决这种问题，正则表达式提供了非捕获分组（non-capturing group），非捕获分组类似普通的捕获分组，只是在开括号后紧跟一个问号和冒号
    (?:...)，这样的括号叫做非捕获型括号，它只能限定量词的作用范围，不捕获任何文本。

    在引用分组时，分组的编号同样会按开括号出现的顺序从左到右递增，只是必须以捕获分组为准，会略过非捕获分组。
 */
describe('non-capturing', () => {
    expect(/(\d{4})-(\d{2})-(\d{2})/.exec('2010-12-22')[2]).toBe('12');
    expect(/(?:\d{4})-(\d{2})-(\d{2})/.exec('2010-12-22')[2]).toBe('22'); // 非捕获分组，序号会跳过

    expect(/(?:\d{4})-(?<month>\d{2})-(\d{2})/.exec('2010-12-22').groups.month).toBe('12');
});

/*
    转义： 括号的转义与之前的量词不同，与括号有关的所有三个元字符 (,),| 都必须转义
 */
describe('transferred meaning', () => {
    expect(/^\(a|b\)$/.test('(a|b)')).toBeTruthy(); // JavaScript中这个表现并不一致...
    expect(/^\(a\|b\)$/.test('(a|b)')).toBeTruthy();

});


describe('a special example', () => {
    const regexp = /(\w+\.?)+/;
    const matcher = regexp.exec('aaa.bbb.ccc');

    /*
        这里匹配的结果不是 aaa. 而是ccc的原因是：表达式结尾用了 +,所以整个表达式的匹配过程中，括号内的  \w+\.?  会多次匹配
     */
    expect(matcher[1]).toBe('ccc');

    // 使用忽略优先量词，就会捕获到最开始的匹配内容
    expect(/(\w+\.?)+?/.exec('aaa.bbb.ccc')[1]).toBe('aaa.');
});

/*
    捕获分组的个数不能动态变化，单个正则表达式里有多少个捕获分组，一次匹配成功之后，结果中就必然存在多少个对应元素（捕获分组匹配的文本）
    如果不能预先规定匹配结果中元素的个数，就不能使用捕获分组。
    如果要匹配数目不定的多段文本，必须通过多次匹配完成。
 */
