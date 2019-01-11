const axios = require('axios')
const should = require('should')

describe('Array', function () {
  describe('用户管理', function () {
    it('登录', function () {
      axios.post('http://47.107.155.139:8360/api/auth/login',{
        email: '123@qq.com',
        password: 'abcd',
      }).then(function(response) {
        const result = response.data.data
        console.log(result)
        should(result).have.property('user_email','123@qq.com').and.be.a.String()
        should(result).have.property('user_name','abcd').and.be.a.String()
        should(result).have.property('avatar')
      })
    });

    it.only('注册', function () {
      axios.post('http://47.107.155.139:8360/api/auth/register',{
        email: '123456@hotmail.com',
        username: '奇迹的贝伦',
        password: 'bb',
      }).then(function(response) {
        const result = response.data.data
        console.log(result)
        result.should.equal('1641084984@qq.com注册成功');
      })
    });
  });
});