package com.xiaolu.util;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import com.xiaolu.bean.Access_Token;

import net.sf.json.JSONObject;

/**
* 获取 accessToken 和 openid
* @param appID 微信公众号凭证
* @param appScret 微信公众号凭证秘钥
* @return
*/

public class AccessTokenUtil {
	
	/**
	 * 获取 token
	 * @param appID
	 * @param appScret
	 * @return
	 */
	public static Access_Token getAccessToken(String appID, String appScret) {
		
		Access_Token token = new Access_Token();
		
		// 访问微信服务器
		String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appID + "&secret="
		+ appScret;
		
		
		try {
			URL getUrl=new URL(url);
			HttpURLConnection http=(HttpURLConnection)getUrl.openConnection();
			http.setRequestMethod("GET");
			http.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
			http.setDoOutput(true);
			http.setDoInput(true);
			
			http.connect();
			InputStream is = http.getInputStream();
			int size = is.available();
			byte[] b = new byte[size];
			is.read(b);
			
			String message = new String(b, "UTF-8");
			
			JSONObject json = JSONObject.fromObject(message);
			
			System.out.println(json);
			
			token.setAccess_token(json.getString("access_token"));
			token.setExpires_in(new Integer(json.getString("expires_in")));
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
			return token;
	}
	
	/**
	 * 获取用户openid
	 * @param appID
	 * @param appScret
	 * @param code
	 * @return
	 */
	public static String getOpenid(String appID, String appScret,String code) {
		
		String openid= "";
		
		// 访问微信服务器
		String url = "https://api.weixin.qq.com/sns/jscode2session?appid="+appID+"&secret="+appScret+"&js_code="+code+"&grant_type=authorization_code";
		
		try {
			URL getUrl=new URL(url);
			HttpURLConnection http=(HttpURLConnection)getUrl.openConnection();
			http.setRequestMethod("GET");
			http.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
			http.setDoOutput(true);
			http.setDoInput(true);
			
			http.connect();
			InputStream is = http.getInputStream();
			int size = is.available();
			byte[] b = new byte[size];
			is.read(b);
			
			String message = new String(b, "UTF-8");
			
			JSONObject json = JSONObject.fromObject(message);
			
			System.out.println(json);
			
			openid = json.getString("openid");
			System.out.println(json.getString("openid"));
			
//			token.setAccess_token(json.getString("access_token"));
//			token.setExpires_in(new Integer(json.getString("expires_in")));
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
			return openid;
	}
}

