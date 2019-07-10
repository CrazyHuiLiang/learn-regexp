//const expressions = require('./expressions.js');
/*
	创建一个正则表达式
	var expression = / pattern / flags;			// 在ES3中所用使用字面量方式创建的正则表达式会共用同一个RegExp实例，在ES5后就和使用构造函数没有这一区别了(IE9+)
	var expression = new RegExp(pattern, flags) // pattern是字符串类型，相对于字面量写法，如果有需要转义的字符串，使用构造函数的写法就需要再多一次转义
	
	pattern： 可以是任何正则表达式(包含字符类、限定符、分组、向前查找、反向引用),模式中使用的所有元字符都必须转义。正则表达式中的元字符包括 ( [ { \ ^ $ | ) ? * + . ] }
	flags： 
		g: 表示全局（global）模式，即模式将被应用于所有字符串，而非在发现第一个匹配项时立即停止
		i: 表示不区分大小写（case-insensitive)模式，即在确定匹配项时忽略模式与字符串的大小写
		m: 表示多行（multiline）模式，即在到达一行文本末尾时还会继续查找下一行中是否存在与模式匹配的项
		u: 支持Unicode扩展字符集的匹配（ES6新增）
		y: 影响搜索过程的sticky属性,后面会具体介绍（ES6新增）
*/

/*
	匹配字符串中所有的‘at’实例
*/
var pattern1 = /at/g;

/*
	匹配第一个'bat'或'cat',不区分大小写
*/
var pattern2 = /[bt]at/i;
// 用于判断正则表达式是否具有g标识
console.log('global\t\t', pattern2.global); // global		 false
// 用于判断正则表达式是否具有i标识
console.log('ignoreCase\t', pattern2.ignoreCase);
// 下一次正则匹配的起始位置
console.log('lastIndex\t', pattern2.lastIndex);
// 用于判断正则表达式是否具有m标识
console.log('multiline\t', pattern2.multiline);
// 返回正则表达式的字面量字符, 在ES6之前会返回包括表达式标示完整的字面量，ES6之后，只返回表达式本身，不包含标示（为获取标示提供了单独的flags属性）。
console.log('source\t\t', pattern2.source);
//source返回正则表达式的字面量字符, 在ES6之前会返回包括表达式标示完整的字面量，ES6之后，只返回表达式本身，不包含标示（为获取标示提供了单独的flags属性）。
console.log('flags', pattern2.flags); // flags i
// sticky属性来判断表达式是否有y标示
console.log('sticky', pattern2.sticky); // sticky false
// unicode属性用来判断正则表达式有没有u标识符
console.log('unicode', pattern2.unicode); // unicode false



// 在ES3中，字面量会使用同一个RegExp实例, 会导致下面两个打印结果是不同的，
let regExpression;
for (let i = 0; i < 10; i++) {
	regExpression = /cat/gi;
	console.log(regExpression.test('catastrophe'));
}
// 使用new操作符每次创建一个新实例
for (let i = 0; i < 10; i++) {
	regExpression = new RegExp('cat', 'gi');
	console.log(regExpression.test('catastrophe'));
}



// 正则表达式exec函数执行后，如果字符串不匹配正则表达式，会返回null，可以匹配的话，会返回一个数组对象，数组的第一项为匹配的字符串，其后为捕获组所捕获的字符串，如果表达式中不含捕获组，数组就只有一项数据，该数组对象相对于普通数组会拥有额外的两个属性index和input，index是字符串中匹配字串首字符的下标，input即被校验的字符串。
var text = 'mom and dad and baby';
var pattern = /mom( and dad( and baby)?)?/gi;
var matches = pattern.exec(text);
if (matches) {
	console.log(matches.index); // 0
	console.log(matches.input); // mom and dad and baby
	console.log(matches[0]); // mom and dad and baby
	console.log(matches[1]); //  and dad and baby
	console.log(matches[2]); //  and baby
}



/*
	正则中不使用g标志时，每次调用exec函数都会返回第一个匹配项的信息,表达式的lastIndex属性每次都返回0
*/
var text = 'cat, bat, sat, fat';
var pattern = /.at/;

var matches = pattern.exec(text);
console.log(matches.index, matches[0], pattern.lastIndex); // 0 'cat' 0

var matches = pattern.exec(text);
console.log(matches.index, matches[0], pattern.lastIndex); // 0 'cat' 0
/*
	正则中使用g标志时，每次调用exec后都会返回新的匹配项，直到没有匹配项,表达式的lastIndex属性每次都调用过exec都会增加，变为上次匹配字符的后一字符的下标
*/
var pattern = /.at/g;

var matches = pattern.exec(text);
console.log(matches.index, matches[0], pattern.lastIndex); // 0 'cat' 3
var matches = pattern.exec(text);
console.log(matches.index, matches[0], pattern.lastIndex); // 5 'bat' 8
var matches = pattern.exec(text);
console.log(matches.index, matches[0], pattern.lastIndex); // 10 'sat' 13
var matches = pattern.exec(text);
console.log(matches.index, matches[0], pattern.lastIndex); // 15 'fat' 18



/*
	正则表达式中的text方法接收一个字符串参数，当前模式与参数匹配的话返回true，否则返回false，test方法经常用于只想要检测字符是否符合规则，不关心字符内容的场景，常用于对用户输入进行校验。
*/
var text = '000-00-0000';
var pattern = /\d{3}-\d{2}-\d{4}/;
console.log(pattern.test(text)); // true

/*
	值得注意的是，表达式中有g标示时，同exec函数一样，每次执行会从上次匹配结尾处向后继续尝试匹配，完成最后一次匹配后的下一次调用将会返回false，再下一次调用会重新从字符串开始处进行模式匹配。
*/
var text = 'bad dad eazy go mad.';
var pattern = /.ad/g;
console.log(pattern.test(text)); // true
console.log(pattern.test(text)); // true
console.log(pattern.test(text)); // true
console.log(pattern.test(text)); // false

/*
	RegExp构造函数包含一些属性，这些属性适用于作用域中的所有正则表达式，并且基于所执行的最后一次正则表达式操作而变化。
*/
var text = 'this is a wonderful year!';
var pattern = /(...)der(...)/gi;
if (pattern.test(text)) {
	// 最近一次要匹配的字符串（Opera未实现）
	console.log(RegExp.input); // this is a wonderful year!
	console.log(RegExp.$_); // this is a wonderful year!
	
	// 最近的一次匹配（Opera未实现）
	console.log(RegExp.lastMatch); // wonderful
	console.log(RegExp['$&']) // wonderful
	
	// 最近一次匹配的捕获组（Opera未实现）
	console.log(RegExp.lastParen); // ful
	console.log(RegExp["$+"]); // full
	
	// 所有表达式都使用多行模式,boolean类型（nodejs,IE和Opera未实现）
	console.log(RegExp.multiline);
	console.log(RegExp['$*']);
	
	// input字符串中lastMatch之前的文本(Opera不支持短属性名）
	console.log(RegExp.leftContext); // this is a 
	console.log(RegExp["$`"]); // this is a 
	
	// input字符串中lastMatch之后的文本(Opera不支持短属性名）
	console.log(RegExp.rightContext); // year!
	console.log(RegExp["$'"]); // year!
	
	// 还有9个用来存储捕获组的属性名别是RegExp.$1, RegExp.$2 ... RegExp.$9，调用exec或text函数时这些属性会被自动填充。
	console.log(RegExp.$1); // won
	console.log(RegExp.$2); // ful
}


/*

正则表达式的限制

匹配字符串开始和结尾的\A和\Z锚，但完全支持以插入符（^）和美元符($)来匹配字符串的开始和结尾

向后查找(lookbehind),但完全支持lookahead

并集和交集类

原子组(atomic grouping)

Unicode支持(单个字符除外，入\uFFFF)

命名的捕获组，但支持编号的捕获组

s（single，单行）和x（free-spacing，无间隔）匹配模式

条件匹配

正则表达式注解
*/



// 最后补充: 正则表达式的toLocalString() 和 toString() 方法都会返回正则表达式的字面量，与创建方式无关，valueOf函数返回表达式本身


console.log('-------------------------------string--------------------------------');
/*
	String类型具有match函数，接收一个正则表达式作为参数，如果正则表达式没有g标示时，返回值和调用后RegExp的exec函数相同。在执行match函数后，RegExp函数的input、lastMatch、input、leftContext等静态属性同样会被填充
*/

var text = 'cat, bat, sat, fat';
var pattern = /(.)at/;

var matches = text.match(pattern);
console.log(matches.index); // 0
console.log(matches[0]); // cat
console.log(matches[1]); // c
console.log(pattern.lastIndex); // 0
console.log(RegExp.input); // cat, bat, sat, fat
console.log(RegExp.lastMatch); // cat
console.log(RegExp.leftContext); //
console.log(RegExp.rightContext); // , bat, sat, fat


/*
	当正则表达式中有g标识符并成功匹配的时，match函数返回一个普通数组，里面保存有所有的匹配字串。
*/

var text = 'cat, bat, sat, fat';
var pattern = /(.)at/g;

var matches = text.match(pattern);
console.log(matches); // [ 'cat', 'bat', 'sat', 'fat' ]
console.log(matches[0]); // cat
console.log(matches[1]); // bat
console.log(matches[2]); // sat
console.log(pattern.lastIndex); // 0
console.log(RegExp.input); // cat, bat, sat, fat
console.log(RegExp.lastMatch); // cat
console.log(RegExp.leftContext); // fat
console.log(RegExp.rightContext); // cat, bat, sat, 


/*
	String类型search方法接收一个正则表达式参数，如果字符串与正则匹配时，返回第一个匹配的位置，如果不匹配，返回-1
*/
var text = 'cat, bat, sat, fat';
var pattern = /at/;
console.log(text.search(pattern)); // 1

/*
	String类型replace函数可以方便的替换字符串内容并返回替换后的新字符串，该函数接收两个参数。
		参数1: 一个字符串或一个正则表达式，使用字符串只能替换第一个匹配项，如果想要替换所有的匹配字串，只能通过传入一个具有g标示的正则表达式
		参数2: 一个字符串或一个函数，用来替换匹配的内容
*/

var text = 'cat, bat, sat, fat';
console.log(text.replace('at', 'ond')); // cond, bat, sat, fat
console.log(text.replace(/at/g, 'ond')); // cond, bond, sond, fond

/*
	当第二个参数为字符串时，还可以使用一些特殊的字符序列,通过这些字符序列，可以使用最后一次匹配结果中的内容。
	$$		$
	$&		匹配整个模式的子字符串，与RegExp.lastMatch的值相同
	$'		匹配的子字符串之前的子字符串。与RegExp.leftContext的值相同
	$`		匹配的子字符串之后的子字符串。与RegExp.rightContext的值相同
	$n		匹配第n个捕获组的子字符串。其中n为1～99的数字
*/

var text = 'cat, bat, sat, fat';
console.log(text.replace(/(.a)(t)/g, 'word ($1$2)'));

/*
	当第二个参数为函数时，该函数接受的参数依次是 匹配的子串、第一个捕获组、第二个捕获组、 ... 、匹配到的子串在原位置的偏移量、被匹配的原字符。该函数需要返回一个字符串类型的值。
*/
function htmlEscape(text) {
	return text.replace(/[<>"&]/g, function (match, pos, originalText) {
		switch (match) {
			case '<':
				return '&lt;';
			case '>': 
				return '&gt;';
			case '&':
				return '&amp;';
			case '"': 
				return '&quot;';
		}
	});
}
console.log(htmlEscape('<p class="greeting"> Hello world! </p>')); // &lt;p class=&quot;greeting&quot;&gt; Hello world! &lt;/p&gt;


/*
	String类型的split函数可以将一个字符串按指定的切分符切分成一系列的子串并以数组形式返回，该函数第一个参数为分隔符，可以是字符串类型也可以是正则表达式，第二个可选参数是一个整型，用来限制所需要返回数组的最大长度。
*/
var pattern = /.a/i;
var text = 'my name is NAT';
console.log(text.split(pattern)); // [ 'my ', 'me is ', 'T' ]



/*
	在ES6之前字符串都是使用16位（UTF-16）字符编码的，在过去16位足以包含任何字符，直到Unicode引入扩展字符集，字符长度限制在16位将不足以表示这么多的字符，编码规则才不得不进行变更，在UTF-16中前2的16次方个码位均以16位编码单元表示，这个范围被称为基本多文种平面（BMP），超出这个范围的要归属于某个辅助平面，因为其中的码位仅用16位无法表示，UTF-16引入的代理对，其规定使用两个16位编码单元表示一个码位。所以现在的js字符串中有两种字符，一种是由一个编码单元16位表示的BMP字符，另一种是有32位表示的辅助平面字符。ES5中的对字符串操作都是针对16位编码单元的，如果同样对包含代理对的字符串进行使用，可能结果会与预期不符，正则表达式中新增了u标识来正确匹配包含代理对的字符。同时也为正则表达式增加了unicode属性用来判断正则表达式有没有u标识符。另一新增属性是flags，用于查看正则表达式的所有标识。
*/
var s = '𠮷'; // 注意这是一个日语字符，并不是吉利的吉，读音是yoshi（同理，𠮷野家并不读 ’ji ye jia‘，因为第一个字是日文符号，发音是yoshi...）
var pattern = /^.$/;
console.log(pattern.test(s)); // false
console.log(pattern.unicode); // false
console.log(pattern.flags); // 

var pattern = /^.$/u;
console.log(pattern.test(s)); // true
console.log(pattern.unicode); // true
console.log(pattern.flags); // u

/*
	ES6新增了y标识，使用y修饰符后，会从正则表达式的lastIndex处开始匹配，匹配失败将不再继续匹配，需要注意的是y标识只对正则表达式的exec和test方法有效，对字符串的方法无效；如果正则表达式中含有^且lastIndex的值不为0时，表达式会永远都不会匹配成功。
	可以通过正则表达式的sticky属性来判断表达式是否有y标示。
*/

var text = 'hello hexo.';
var pattern1 = /h/g;
console.log('sticky', pattern1.sticky); // sticky false
console.log(pattern1.test(text)); // true
pattern1.lastIndex = 2;
console.log(pattern1.test(text)); // true

var pattern2 = /h/gy;
console.log('sticky', pattern2.sticky); // sticky true
console.log(pattern2.test(text)); // true
pattern2.lastIndex = 2;
console.log(pattern2.test(text)); // false


/*
	在ES5中，可以给RegExp构造函数传递一个正则表达式来复制此表达式，如果第一个参数是正则表达式时，不允许有第二个参数，否则会报错，在ES6中，可以给第二个字符类型的参数用作创建的表达式的标示。
*/

var pattern = /hello/i;
console.log(pattern.toString()); // /hello/i
console.log(pattern.test('Hello world')); // true
// 在ES5中会报错，ES6中可以正常执行
var pattern = new RegExp(pattern, 'gmu');
console.log(pattern.toString()); // /hello/gmu
console.log(pattern.test('Hello world')); // false

/*
	在ES6之前的运行环境中使用标示u/y会导致执行错误，在使用前应该先确认执行环境是否支持u/y标示
*/
function hasRegExpU() {
	try {
		var pattern = new RegExp('.', 'u');
		return true;
	} catch (e) {
		return false;
	}
}

if (hasRegExpU()) {
//	...
}


