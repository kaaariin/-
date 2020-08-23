//数値を通過書式「#,###,###」に変換するフィルター
Vue.filter('number_format',function(val) {
    return val.toLocaleString();
})

var app = new Vue({
    el: '#app',
    data: {
        //「セール対象」のチェック状態（true：チェックあり、false：チェックなし)
        showSaleItem: false,
        //「送料無料」のチェック状態（true：チェックあり、false：チェックなし)
        showDelvFree: false,
        //「並び替え」の選択値（１：標準、２：価格が安い順）
        sortOrder: 1,
        //商品リスト
        products: [],
        //エラーの有無
        isError: false,
        //メッセージ
        message: ''
    },
    //ライフサイクルハック
    created: function() {
        //JSONPのURL（サーバーに配置する）
        var url = 'products.js';
        //非同期通信でJSONPを読みこむ
        $.ajax({
            url: url,
            type: 'GET', //通信先URL
            dataType: 'jsonp',　//使用するHTTPメソッド
            jsonp: 'callback',　//クエリパラメータの名前
            jsonpCallback: 'products' //コールバック関数の名前
        })
        .done(function(data,textStatus,errorThrown) {
            this.products = data;
        }.bind(this))
        .fail(function(jqXHR,textStatus,errorThrown) {
            this.isError = true;
            this.message = '商品リストの読み込みに失敗しました';
        }.bind(this));
    },
    computed: {
        //絞り込みあとの商品リストを返す算出プロパティ
        filteredList: function() {
            //絞り込み後の商品リストを角のする新しい配列
            var newList = [];
            for(var i=0; i<this.products.length; i++) {
                //表示対象かどうかを判定するフラグ
                var isShow = true;
                //i番目の商品が表示対象かどうかを判定する
                if(this.showSaleItem && !this.products[i].isSale) {
                    //「セール対象」チェック有りで、セール対象商品でない場合
                    isShow = false; //この商品は表示しない
                }
                if(this.showDelvFree && this.products[i].delv > 0) {
                    console.log(this.products[i].delv > 0);
                    //「送料無料」チェック有りで、送料ありの商品の場合
                    isShow = false; //この商品は表示しない
                }
                // 表示対象の商品だけを新しい配列に追加する
                if(isShow) {
                    newList.push(this.products[i]);
                }
            }
            //新しい配列を並び替える
            if(this.sortOrder == 1) {
                //元の順番にpushしているので並び替え済み
            }
            else if(this.sortOrder == 2) {
                //価格が安い順に並び替える
                newList.sort(function(a,b) {
                    return a.price - b.price;
                });
            }
            //絞り込み後の商品を返す
            return newList
        },
        count: function() {
            return this.filteredList.length;
        }
    },
    watch: {
        //「セール対象」チェックボックスの状態を監視するウォッチャ
        showSaleItem: function(newVal,oldVal) {
            //ここでproductsの配列を書き換える
            console.log('showSalaItemウォッチャが呼び出されました');
        },
        showDelvFree: function(newVal,oldVal) {
            //ここでproductsの配列を書き換える
            console.log('showDelvFreeウォッチャが呼び出されました');
        }
    }
});


// // コンポーネントのルートノード
// var nodeApp = document.querySelector('#app');

// //チェックボックスのイベントハンドラを登録
// var nodeCheckbox = nodeApp.querySelectorAll('input[type="checkbox"]');
// nodeCheckbox[0].addEventListener('change',onCheckChange,false);
// nodeCheckbox[1].addEventListener('change',onCheckChange,false);

// //セレクトボックスのイベントハンドラを登録
// var nodeSelect = nodeApp.querySelector('.sorting');
// nodeSelect.addEventListener('change',onOrderChange,false);

// //初期表示時の商品ノードリスト（保存用）
// var nodeItemsOrg = nodeApp.querySelectorAll('.item');

// //チェック状態変更イベントハンドラ
// function onCheckChange(event) {

//     var nodeItems = nodeApp.querySelectorAll('.item');//商品ノードのリスト
//     var nodeCount = nodeApp.querySelector('.count');//表示件数のノード
//     var count = nodeItems.length;

//     //全ての商品ノードをいったん表示する
//     for(var i = 0; i<nodeItems.length; i++) {
//         showNode(nodeItems[i]);
//     }

//     //セール対象のチェックがついている場合
//     if(nodeCheckbox[0].checked) {
//         //全ての商品ノードを捜査
//         for(var i = 0; i<nodeItems.length; i++) {
//             //セール対象の商品では無い場合
//             if(!isSaleItem(nodeItems[i])) {
//                 //この商品を非表示にする
//                 hideNode(nodeItems[i]);
//                 //件数のカウントを減らす
//                 count--;
//             }
//         }
//     }
//     //送料無料のチェックがついている場合
//     if(nodeCheckbox[1].checked) {
//         //全ての商品ノードを捜査
//         for(var i=0; i<nodeItems.length; i++) {
//             //商品無料の商品では無い場合
//             if(!isDelvFreeItem(nodeItems[i])) {
//                 //この商品を非表示にする
//                 hideNode(nodeItems[i]);
//                 //件数カウントを減らす
//                 count--;
//             }
//         }
//     }
//     //件数を更新
//     nodeCount.textContent = count + '件';
// }

// //並び順の変更イベントハンドラ
// function onOrderChange(event) {
//     var nodeList = nodeApp.querySelector('.list'); //商品一覧ノード
//     var nodeItems = nodeApp.querySelectorAll('.item'); //商品ノードのリスト

//     //商品ノードのリストを新しい配列につめる（退避しておく）
//     var products = [];
//     for(var i=0; i<nodeItems.length; i++) {
//         products.push(nodeItems[i]);
//         console.log(products.push(nodeItems[i]));
//     }
//     // //DOMから全ての商品ノードを削除する
//     // while(nodeList.firstChild) {
//     //     nodeList.removeChild(nodeList.firstChild);

//     // }

//     //「標準」が削除されている場合
//     if(event.target.value == '1') {

//         //初期表示の商品ノードを復元する
//         for(var i=0; i<products.length; i++) {
//             nodeList.appendChild(nodeItemsOrg[i]);
//         }
//     }
//     //「価格が安い順」が選択されている場合
//     else if(event.target.value == '2') {
//         //配列を並び替え
//         products.sort(function(a,b) {
//             //商品価格のノードからカンマを除去した数値を読み取る
//             var prevPrice = parseInt(a.querySelector('.price span').textContent.replace(',',
//             ''));
//             var currentPrice = parseInt(b.querySelector('.price span').textContent.replace(',',
//             ''));
//             return prevPrice - currentPrice;
//         });
//         //並び替えあとの商品ノードをDOMに追加する
//         for(var i=0; i<products.length; i++) {
//             nodeList.appendChild(products[i]);

//         }
//     }
// }

// //セール商品かどうかを判定する関数
// function isSaleItem(nodeItem) {
//     var node = nodeItem.querySelector('.status');
//     return (node && node.textContent == 'SALE')
// }
// //送料無料かどうかを判定する関数
// function isDelvFreeItem(nodeItem) {
//     var node = nodeItem.querySelector('.shipping-fee');
//     return (node && node.textContent =='送料無料')
// }

// //ノードを非表示にする関数
// function hideNode(node) {
//     node.setAttribute('style','display:none');
// }
// //ノードを表示する関数
// function showNode(node) {
//     node.removeAttribute('style');
// }

