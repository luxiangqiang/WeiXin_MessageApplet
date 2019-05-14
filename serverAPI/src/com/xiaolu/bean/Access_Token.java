package com.xiaolu.bean;

/**
 * 功能：access_token 实体类
 * @author Boy Baby
 *
 */
public class Access_Token {
	
	//获取到的access_token
	private String access_token; 
	
	//有效时间（两个小时，7200s）
	private int expires_in; 
	
	public String getAccess_token() {
		return access_token;
	}
	
	public void setAccess_token(String access_token) {
		this.access_token = access_token;
	}
	
	public int getExpires_in() {
		return expires_in;
	}
	
	public void setExpires_in(int expires_in) {
		this.expires_in = expires_in;
	}
}
