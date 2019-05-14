package com.xiaolu.ThreadGetdata;

import com.xiaolu.bean.Access_Token;
import com.xiaolu.util.AccessTokenUtil;

public class TokenThread implements Runnable{
	//微信公众号的凭证和秘钥
	public static final String appID = "";// 你的微信小程序 AppId
	public static final String appScret = ""; // 你小程序的的 appScret（官网查看）
	public static Access_Token access_token=null; 

	@Override
	public void run() {
		while(true){
			try {
				//调用工具类获取access_token(每日最多获取100000次，每次获取的有效期为7200秒)
				access_token = AccessTokenUtil.getAccessToken(appID, appScret); 
				if(null!=access_token){
				System.out.println("accessToken获取成功："+access_token.getExpires_in());
				//7000秒之后重新进行获取
				Thread.sleep((access_token.getExpires_in()-1000)*1000);
				}else{
					//获取失败时，60秒之后尝试重新获取
					Thread.sleep(30*1000);
				}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
}

