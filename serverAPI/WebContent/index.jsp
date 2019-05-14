<%@page import="com.xiaolu.util.WxUtils"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	//在接口配置信息设置的Token
	String token = "jsharelife";
	//接收微信服务器三个参数
	String signature = request.getParameter("signature");
	String timestamp = request.getParameter("timestamp");
	String nonce = request.getParameter("nonce");
	//进行验证
	try{
		if(WxUtils.checkSingature(signature,token,timestamp,nonce)){
			//返回echostr
			response.getOutputStream().print(request.getParameter("echostr"));
			out.clear();  
			out = pageContext.pushBody();  
		}
	} catch(Exception e) {
		e.printStackTrace();
	}
%>
