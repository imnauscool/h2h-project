package com.highradius;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class EditSalesOrder
 */
@WebServlet("/EditRecord")
public class EditSalesOrder extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EditSalesOrder() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String salesOrder = null;
		
		try {
			BufferedReader reader = request.getReader();
			salesOrder = reader.readLine();
			
			salesOrder = salesOrder.substring(9,  salesOrder.length() - 2);
			String final_values[] = salesOrder.split(",");
			
			for(int i = 0; i < final_values.length; ++i) {
				final_values[i] = final_values[i].split(":")[1];
				if(final_values[i].charAt(0) == '\"') {
					final_values[i] = final_values[i].substring(1, final_values[i].length() - 1);
				}
			}
			String salesOrderNumber = final_values[0];
			String salesOrderAmount = final_values[1];
			String notes = final_values[2];
			salesOrderNumber = salesOrderNumber.replaceAll("[\\[\\](){}]","");
			
			Connection conn = GetConnection.connectToDB();
			String sql_statement = "UPDATE winter_internship SET invoice_currency = ?, cust_payment_terms = ? WHERE sl_no = ?";
			
			PreparedStatement st = conn.prepareStatement(sql_statement);
			st.setString(3, salesOrderNumber);
			st.setString(1, salesOrderAmount);
			st.setString(2, notes.isEmpty() ? null : notes);
			
			st.executeUpdate();
			conn.close();
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}

}
