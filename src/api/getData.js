import fetch from '../config/fetch'
/**
 * 登录
 */

export const mobileLogin = data => fetch('/back-user-web/auth/login/mobileLogin.do', data, 'POST');

/**
 * 注销
 */

export const weixinLogOut = data => fetch('/back-user-web/auth/login/weixinLogOut.do', data, 'POST');

/**
 * 验证手机验证码是否正确接口
 */

export const bindingMobileMobileVerification = data => fetch('/back-user-web/user/user/bindingMobileMobileVerification.do', data, 'POST');

/**
 * 根据微信openid登录接口
 */

export const weiXinLoginByWeiXinOpenId = data => fetch('/back-user-web/auth/login/weiXinLoginByWeiXinOpenId.do', data, 'POST');

/**
 * 根据微信登录接口
 */

export const weiXinLogin = data => fetch('/back-user-web/auth/login/weiXinLogin.do', data, 'POST');

/**
 * 用户注册接口
 */

export const userRegister = data => fetch('/back-user-web/user/user/userRegister.do', data, 'POST');

/**
 * 获取个人信息接口
 */

export const userByUserId = data => fetch('/back-user-web/user/userExtend/userByUserId.do', data, 'POST');


/**
 * 用户注册，向手机发送验证码
 */

export const sendIdentifyingCode = data => fetch('/back-user-web/user/user/sendIdentifyingCode.do', data, 'POST');

/**
 * 用户手机验证码登录接口
 */

export const userMobileLogin = data => fetch('/back-user-web/auth/login/userMobileLogin.do', data, 'POST');



/**
 * 用户注册，用户绑定手机号
 */

export const bindingMobile = data => fetch('/back-user-web/user/user/bindingMobile.do', data, 'POST');


/**
 * 获取邮箱验证码接口
 */

export const gainVerificationode = data => fetch('/back-user-web/user/user/gainVerificationode.do', data, 'POST');

/**
 * 福管+用户设置支付密码接口
 */

export const setPaymentPassword = data => fetch('/back-user-web/user/user/setPaymentPassword.do', data, 'POST');

/**
 * 找回密码接口
 */

export const findUserPassword = data => fetch('/back-user-web/user/user/findUserPassword.do', data, 'POST');

/**
 * 获取用户资产
 */

export const userAssets = data => fetch('/back-account-web/account/account/userAssets.do', data, 'POST');

/**
 * 获取用户资产
 */

export const accountFlowPage = data => fetch('/back-account-web/account/account/accountFlowPage.do', data, 'POST');

/**
 * 意见反馈接口
 */

export const insertFeedbackWithTx = data => fetch('/back-user-web/user/feedback/insertFeedbackWithTx.do', data, 'POST');



/**
 * 查询前台类目树接口
 */

export const findCategoryByType = data => fetch('/back-product-web/product/categoryTree/findCategoryByType.do', data, 'POST');

/**
 * 根据类目节点id查询子类目节点信息接口
 */

export const findSeedCategoryTreeNodeAll = data => fetch('/back-product-web/product/categoryTreeNode/findSeedCategoryTreeNodeAll.do', data, 'POST');

/**
 * 查询模板结构
 */

export const templateConstruct = data => fetch('/back-cms-web/cms/template/templateConstruct.do', data, 'POST');

/**
 * 查询模板结构
 */

export const instContent = data => fetch('/back-cms-web/cms/inst/instContent.do', data, 'POST');

/**
 *获取健康关爱列表
 */

export const standardUnitByFunctionModuleId = data => fetch('/back-product-web/product/standardUnit/standardUnitByFunctionModuleId.do', data, 'POST');


/**
 *查询用户购物车pu数量接口
 */

export const findCartItemSumByUserId = data => fetch('/back-order-web/order/cartItem/findCartItemSumByUserId.do', data, 'POST');

/**
 *获取商品列表
 */

export const PageActivityMerchantProd = data => fetch('/back-product-web/product/standardUnit/findStandardUnitOfPageAPP.do', data, 'POST');

/**
 *根据su组合id或类目节点id查询susp列表接口
 */

export const findByCategoryTreeNodeIdOrSUC = data => fetch('/back-product-web/product/standardUnit/findByCategoryTreeNodeIdOrSUC.do', data, 'POST');

/**
 *获取banner列表
 */

export const findBannerAll = data => fetch('/back-product-web/product/blessingCoinBanner/findBlessingCoinBannerAllApp.do', data, 'POST');

/**
 *根据ID获取商品详情
 */

export const findMerchantProdetails = data => fetch('/back-product-web/product/standardUnit/findByStandardUnitId.do', data, 'POST');

/**
 *根据ID获取商品规格
 */

export const MerchantProdAttNameAPPById = data => fetch('/back-product-web/product/standardProductUnitAttName/findByStandardUnitId.do', data, 'POST');

/**
 *根据ID获取商品比价信息
 */

export const SellPlatformMerchantProdByMerchantProdId = data => fetch('/back-product-web/product/sellPlatformMerchantProd/SellPlatformMerchantProdByMerchantProdId.do', data, 'POST');

/**
 *根据ID获取商品SKU
 */

export const skuByMerchantProductId = data => fetch('/back-product-web/product/commodityProductUnit/findCommodityProductUnitAllByStandardUnitId.do', data, 'POST');

/**
 *根据su商品id查询su商品限购规则信息列表接口
 */

export const startLimitRuleByStandardUnitId = data => fetch('/back-order-web/order/limitRule/startLimitRuleByStandardUnitId.do', data, 'POST');

/**
 *加入购物车
 */

export const saveCartItem = data => fetch('/back-order-web/order/cartItem/saveCartItemWithTx.do', data, 'POST');


/**
 *购物车列表
 */

export const findPageCartItem = data => fetch('/back-order-web/order/cartItem/findCartItemOfPageByUserId.do', data, 'POST');

/**
 *删除购物车商品
 */

export const cartDeleteById = data => fetch('/back-order-web/order/cartItem/deleteCartItemWithTx.do', data, 'POST');

/**
 *增加购物车商品
 */

export const cartItemNumPlusById = data => fetch('/back-order-web/order/cartItem/addNum.do', data, 'POST');

/**
 *减少购物车商品
 */

export const cartItemNumSubtractById = data => fetch('/back-order-web/order/cartItem/minusNum.do', data, 'POST');

/**
 *生成订单
 */

export const orderConfirm = data => fetch('/back-order-web/order/core/orderConfirm.do', data, 'POST');


/**
 *支付发起页面的标准订单查询接口
 */

export const standardOrderQueryAtPayInvoke = data => fetch('/back-pay-web/pay/core/standardOrderQueryAtPayInvoke.do', data, 'POST');


/**
 *支付方式选择页面的标准订单查询接口
 */

export const standardOrderQueryAtPayMethod = data => fetch('/back-pay-web/pay/core/standardOrderQueryAtPayMethod.do', data, 'POST');


/**
 *订单校验支付密码
 */

export const foscoinAccountDeduct = data => fetch('/back-account-web/account/account/foscoinAccountDeduct.do', data, 'POST');

/**
 *校验是否有支付密码
 */

export const userPayInfo = data => fetch('/back-user-web/user/user/userPayInfo.do', data, 'POST');


/**
 *校验是否有支付密码
 */

export const standardPayCancle = data => fetch('/back-pay-web/pay/core/standardPayCancle.do', data, 'POST');

/**
 *微信原生支付签名
 */

export const nativeWXpaySign = data => fetch('/back-pay-web/pay/core/nativeWXpaySign.do', data, 'POST');

/**
 *查询订单支付状态
 */

export const orderPayConfirm = data => fetch('/back-order-web/order/core/orderPayConfirm.do', data, 'POST');

/**
 *提交订单
 */

export const createOrder = data => fetch('/back-order-web/order/core/createOrder.do', data, 'POST');

/**
 *获取订单列表
 */

export const findOrderByUserAndStatus = data => fetch('/back-order-web/order/core/findOrderByUserAndStatus.do', data, 'POST');

/**
 *取消订单
 */

export const unfreezeSoFubi = data => fetch('/back-order-web/order/core/cancelOrder.do', data, 'POST');

/**
 删除订单
 */

export const deleteBySoId = data => fetch('/back-order-web/order/core/deleteOrder.do', data, 'POST');

/**
 *确认收货
 */

export const affirmOrderBySoId = data => fetch('/back-order-web/order/core/affirmOrderBySoId.do', data, 'POST');

/**
 *查看订单是否在等待队列
 */

export const findAwaitQueueByOrderCode = data => fetch('/back-pay-web/pay/awaitQueue/findAwaitQueueByOrderCode.do', data, 'POST');

/**
 *发票提示
 */

export const invoiceHint = data => fetch('/back-order-web/order/core/invoiceHint.do', data, 'POST');

/**
 *根据发票ID查询详情
 */

export const invoiceById = data => fetch('/back-order-web/order/soInvoice/invoiceById.do', data, 'POST');

/**
 *保存发票信息
 */

export const saveInvoice = data => fetch('/back-order-web/order/core/saveInvoice.do', data, 'POST');



/**
 *获取地址列表
 */

export const findReceiverAddressAll = data => fetch('/back-order-web/order/receiverAddress/findReceiverAddressAll.do', data, 'POST');

/**
 *设置默认地址
 */

export const defaultAddressById = data => fetch('/back-order-web/order/receiverAddress/defaultAddressById.do', data, 'POST');

/**
 *删除地址
 */

export const deleteReceiverAddressWithTx = data => fetch('/back-order-web/order/receiverAddress/deleteReceiverAddressWithTx.do', data, 'POST');

/**
 *省市区三级联动
 */

export const findProvCityAreaAll = data => fetch('/back-order-web/order/provCityArea/findProvCityAreaAll.do', data, 'POST');

/**
 *新增地址
 */

export const insertReceiverAddressWithTx = data => fetch('/back-order-web/order/receiverAddress/insertReceiverAddressWithTx.do', data, 'POST');

/**
 *根据ID查询地址详情
 */

export const findReceiverAddressById = data => fetch('/back-order-web/order/receiverAddress/findReceiverAddressById.do', data, 'POST');


/**
 *开放物流信息查询
 */

export const openDeliveryTrace = data => fetch('/back-order-web/order/soDelivery/openDeliveryTrace.do', data, 'POST');

/**
 *根据订单id查询包裹信息
 */

export const packageBySoId = data => fetch('/back-order-web/order/soPackage/packageBySoId.do', data, 'POST');

/**
 *查看订单详情
 */

export const orderDetail = data => fetch('/back-order-web/order/core/orderDetail.do', data, 'POST');


/**
 *购物车数量
 */

export const cartItemNumByUserId = data => fetch('/back-order-web/order/cartItem/cartItemNumByUserId.do', data, 'POST');

/**
 *修改地址
 */

export const updateReceiverAddressByIdWithTx = data => fetch('/back-order-web/order/receiverAddress/updateReceiverAddressByIdWithTx.do', data, 'POST');



/**
 *获取活动列表
 */

export const activityPage = data => fetch('/back-activity-web/activity/activity/activityPage.do', data, 'POST');

/**
 *进入活动详情之前判断活动有效性
 */

export const preActivityDetail = data => fetch('/back-activity-web/activity/activity/preActivityDetail.do', data, 'POST');

/**
 *根据ID获取活动详情
 */

export const activityDetail = data => fetch('/back-activity-web/activity/activity/activityDetail.do', data, 'POST');

/**
 *根据ID获取活动成员分页列表
 */

export const activityUserPage = data => fetch('/back-activity-web/activity/activity/activityUserPage.do', data, 'POST');

/**
 *报名活动
 */

export const signActivity = data => fetch('/back-activity-web/activity/activity/signActivity.do', data, 'POST');



/**
 *我的活动
 */

export const myActivityPage = data => fetch('/back-activity-web/activity/activity/myActivityPage.do', data, 'POST');




/**
 *纪念日人员列表
 */

export const congrPageHead = data => fetch('/back-congratulation-web/congratulation/congratulation/congrPageHead.do', data, 'POST');

/**
 *纪念日留言墙列表
 */

export const congrPageWall = data => fetch('/back-congratulation-web/congratulation/congratulation/congrPageWall.do', data, 'POST');


/**
 *纪念日留言列表
 */

export const congrWords = data => fetch('/back-congratulation-web/congratulation/congratulation/congrWords.do', data, 'POST');


/**
 *纪念日留言列表
 */

export const sendCongr = data => fetch('/back-congratulation-web/congratulation/congratulation/sendCongr.do', data, 'POST');

/**
 *前端获取客户端第三方支付方式配置
 */

export const getClientPayTypeByClientId = data => fetch('/back-cms-web/cms/clientPayTypeConfig/getClientPayTypeByClientId.do', data, 'POST');
