//数値を通過書式「#,###,###」に変換するフィルター
Vue.filter('number_format',function(val) {
    return val.toLocaleString();
});
