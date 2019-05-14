package com.xiaolu.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.xiaolu.ThreadGetdata.TokenThread;
import com.xiaolu.dao.Tools;
import com.xiaolu.util.AccessTokenUtil;

import net.sf.json.JSONObject;


/**
 * 功能:获取小程序的AppID和Code
 * @author Boy Baby
 *
 */
@WebServlet("/AppIDCodeServlet")
public class AppIDCodeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static final String appID = ""; // 填写你小程序的 APPid
	public static final String appScret = "";// 你小程序的 AppScret（微信小程序官网获取）
	public static String  openid = ""; 
	public static String  token = ""; 
       
    public AppIDCodeServlet() {
        super();
    }


	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//解决乱码
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		
		//启动定时获取access_token的线程
//		new Thread(new TokenThread()).start(); 
		
		//接受数据
		StringBuffer sbJson = new StringBuffer();
		String line = "";
		try{
			//读取网络传输过来的数据
			BufferedReader br = request.getReader();
			//遍历数据并拼接
			while((line = br.readLine())!= null){
				//如果读到数据,把他添加到字符流中  
				sbJson.append(line);
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		System.out.println("client json data =" + sbJson);  
		
		 // 功能:把读取到的数据封装 JSON
		System.out.println("JSON = "+ sbJson.toString());
		JSONObject jsonobject = JSONObject.fromObject(sbJson.toString());
		String code = jsonobject.getString("code");//js_code
		
		openid = AccessTokenUtil.getOpenid(appID, appScret,code); 
		
		token = TokenThread.access_token.getAccess_token();
		
		System.out.println("微信API-openid:"+openid+ "token:" + token);
		
		if(!token.equals("")&&!openid.equals("")){
			JSONObject jsonObject2 = new JSONObject();
			jsonObject2.put("result", "1");
			jsonObject2.put("openid", openid);
			jsonObject2.put("token", token);
			String str = jsonObject2.toString();
			System.out.print("openid"+openid);
			response.getWriter().write(str);	
		}else{
			JSONObject jsonObject2 = new JSONObject();
			jsonObject2.put("result", "0");
			String str = jsonObject2.toString();
			response.getWriter().write(str);	
		}
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
  
}
