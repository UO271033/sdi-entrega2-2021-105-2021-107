package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_SearchOferta {
	

	static public void searchOferta(WebDriver driver, String search) {
		WebElement sfield = driver.findElement(By.name("busqueda"));
		sfield.click();
		sfield.clear();
		sfield.sendKeys(search);
		
		By boton = By.className("btn");
		driver.findElement(boton).click();	
	}
	
	
	
	static public void buyOferta(WebDriver driver, String titulo) {
		WebElement link = driver.findElement(By.id(titulo));
		link.click();
	}

}
