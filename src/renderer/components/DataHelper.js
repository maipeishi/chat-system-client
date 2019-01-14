var axios = require("axios");
axios.defaults.withCredentials = true
const dataHelper = {
    postData:function(context,url,postObj,success,reload,timestamp,actionPath){
        axios.post('http://47.107.155.139:8360/'+url,postObj)
        .then(
            function(response){
                var result = response.data.data
                if(response.data.errmsg) {
                    console.log(response.data.errmsg)
                context.$Notice.error({
                    title: '错误',
                    desc: response.data.errmsg
                });
                return
                }
                success(result)
            },
            function(err){
                console.log(err)
                context.$Notice.error({
                    title: '错误',
                    desc: err
                });
            }
        ).catch(function(Ex) {
            console.log(Ex)
        });
    },
    getData: function(url,success,reload,timestamp,actionPath){
        axios.get('http://47.107.155.139:8360/'+url)
        .then(
            function(response){
                var result = response.data.data
                success(result)
            },
            function(err){
                console.log(err)
            }
        ).catch(function(Ex) {
            console.log(Ex)
        });
    }
};

export default dataHelper;