package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_OwnOfertasView {
	
	
	
	static public void deleteOferta(WebDriver driver, String titulo) {
		
		WebElement link = driver.findElement(By.id(titulo));
		link.click();
		

	}

	public static void destacarOferta(WebDriver driver, String titulo) {
		WebElement link = driver.findElement(By.id(titulo));
		link.click();
	}


}
