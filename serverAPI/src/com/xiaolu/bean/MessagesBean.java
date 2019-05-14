package com.xiaolu.bean;

/**
 * 功能：留言信息实体类
 * @author Boy Baby
 *
 */
public class MessagesBean {
	private int p_id;
	private int g_id;
	private int no;
	private String title;
	private String openid;
	private String username;
	private String headimage;
	private String userMesContent;
	private String authorMesContent;
	private int isCheck;
	private int istop;
	private int zanCounts;
	private int iszan;
	public String getAuthorMesContent() {
		return authorMesContent;
	}
	public void setAuthorMesContent(String authorMesContent) {
		this.authorMesContent = authorMesContent;
	}
	public int getIszan() {
		return iszan;
	}
	public void setIszan(int iszan) {
		this.iszan = iszan;
	}
	public int getP_id() {
		return p_id;
	}
	public void setP_id(int p_id) {
		this.p_id = p_id;
	}
	public int getG_id() {
		return g_id;
	}
	public void setG_id(int g_id) {
		this.g_id = g_id;
	}
	public int getNo() {
		return no;
	}
	public void setNo(int no) {
		this.no = no;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getOpenid() {
		return openid;
	}
	public void setOpenid(String openid) {
		this.openid = openid;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getHeadimage() {
		return headimage;
	}
	public void setHeadimage(String headimage) {
		this.headimage = headimage;
	}
	public String getUserMesContent() {
		return userMesContent;
	}
	public void setUserMesContent(String userMesContent) {
		this.userMesContent = userMesContent;
	}
	public String getAuthorMesCount() {
		return authorMesContent;
	}
	public void setAuthorMesCount(String authorMesCount) {
		this.authorMesContent = authorMesCount;
	}
	public int getIsCheck() {
		return isCheck;
	}
	public void setIsCheck(int isCheck) {
		this.isCheck = isCheck;
	}
	public int getIstop() {
		return istop;
	}
	public void setIstop(int istop) {
		this.istop = istop;
	}
	public int getZanCounts() {
		return zanCounts;
	}
	public void setZanCounts(int zanCounts) {
		this.zanCounts = zanCounts;
	}
}
