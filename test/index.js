const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const assert = chai.assert;
const deepClone = require("../src/index");
describe("基本类型", () => {
  it("是一个类", () => {
    assert.isFunction(deepClone);
  });
  it("能够复制基本类型", () => {
    const n = 123;
    const n2 = deepClone(n)
    assert(n === n2);
    const s = "123456";
    const s2 = deepClone(s);
    assert(s === s2);
    const b = true;
    const b2 = deepClone(b);
    assert(b === b2);
    const u = undefined;
    const u2 = deepClone(u);
    assert(u === u2);
    const empty = null;
    const empty2 = deepClone(empty);
    assert(empty === empty2);
    const sym = Symbol();
    const sym2 = deepClone(sym);
    assert(sym === sym2);
  });


});

describe("对象", () => {
  it('可以复制基本对象', function () {
    const obj1 = {
      a: 1,
      b: 2
    }
    const obj2 = deepClone(obj1)
    assert(obj1.a === obj2.a)
    assert(obj1 !== obj2)
  });
  it('可以复制环', function () {
    const obj1 = {
      a: 1,
      b: 2,child:[1, 3]
    }
    obj1.self = obj1
    const obj2 = deepClone(obj1)
    assert(obj1.a === obj2.a)
    assert(obj1 !== obj2)
    assert(obj2.self === obj2)
    assert(obj2.self.a === obj2.a)
  });

  it('可以复制数组', function () {
    const arr1 = [[1, 2], 1, 3, 5]
    const arr2 = deepClone(arr1)
    assert(arr2[0] !== arr1[0])
    assert(arr2[1] === arr1[1])
    assert(arr2[0][0] === arr1[0][0])
    assert(arr2 !== arr1)
  });
  it('可以复制函数', function () {
    const a = function(x, y) {
      return x + y;
    };
    a.xxx = { yyy: { zzz: 1 } };
    const a2 = deepClone(a);
    assert(a !== a2);
    assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
    assert(a.xxx.yyy !== a2.xxx.yyy);
    assert(a.xxx !== a2.xxx);
    assert(a(1, 2) === a2(1, 2));
  });


  it('可以复制正则', function () {
    const reg = new RegExp("hi\\d+", "gi")
    reg.xxx = { yyy: { zzz: 1 } };
    const reg2 = deepClone(reg)
    assert(reg !== reg2)
    assert(reg.source === reg2.source)
    assert(reg.flags === reg2.flags)
    assert(reg.flags === reg2.flags)
    assert(reg.xxx.yyy.zzz === reg2.xxx.yyy.zzz);
    assert(reg.xxx.yyy !== reg2.xxx.yyy);
    assert(reg.xxx !== reg2.xxx);

  });
  it("可以复制日期", () => {
    const a = new Date();
    a.xxx = { yyy: { zzz: 1 } };
    const a2 = deepClone(a);
    assert(a !== a2);
    assert(a.getTime() === a2.getTime());
    assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
    assert(a.xxx.yyy !== a2.xxx.yyy);
    assert(a.xxx !== a2.xxx);
  });


  it("自动跳过原型属性", () => {
    const a = Object.create({ name: "a" });
    a.xxx = { yyy: { zzz: 1 } };
    const a2 = deepClone(a);
    assert(a !== a2);
    assert.isFalse("name" in a2);
    assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
    assert(a.xxx.yyy !== a2.xxx.yyy);
    assert(a.xxx !== a2.xxx);
  });


  it("很复杂的对象", () => {
    const a = {
      n: NaN,
      n2: Infinity,
      s: "",
      bool: false,
      null: null,
      u: undefined,
      sym: Symbol(),
      o: {
        n: NaN,
        n2: Infinity,
        s: "",
        bool: false,
        null: null,
        u: undefined,
        sym: Symbol()
      },
      array: [
        {
          n: NaN,
          n2: Infinity,
          s: "",
          bool: false,
          null: null,
          u: undefined,
          sym: Symbol()
        }
      ]
    };
    const a2 =  deepClone(a);
    assert(a !== a2);
    assert.isNaN(a2.n);
    assert(a.n2 === a2.n2);
    assert(a.s === a2.s);
    assert(a.bool === a2.bool);
    assert(a.null === a2.null);
    assert(a.u === a2.u);
    assert(a.sym === a2.sym);
    assert(a.o !== a2.o);
    assert.isNaN(a2.o.n);
    assert(a.o.n2 === a2.o.n2);
    assert(a.o.s === a2.o.s);
    assert(a.o.bool === a2.o.bool);
    assert(a.o.null === a2.o.null);
    assert(a.o.u === a2.o.u);
    assert(a.o.sym === a2.o.sym);
    assert(a.array !== a2.array);
    assert(a.array[0] !== a2.array[0]);
    assert.isNaN(a2.array[0].n);
    assert(a.array[0].n2 === a2.array[0].n2);
    assert(a.array[0].s === a2.array[0].s);
    assert(a.array[0].bool === a2.array[0].bool);
    assert(a.array[0].null === a2.array[0].null);
    assert(a.array[0].u === a2.array[0].u);
    assert(a.array[0].sym === a2.array[0].sym);
  });


  xit("不会爆栈", () => {
    const a = { child: null };
    let b = a;
    for (let i = 0; i < 10000; i++) {
      b.child = {
        child: null
      };
      b = b.child;
    }
    const a2 = deepClone(a);
    assert(a !== a2);
    assert(a.child !== a2.child);
  });
})
