import { useState, useEffect } from 'react';
import { getAllUnits, getAllCategories, getAllTaxCategory } from 'api/services/InventoryService';
import { getAllVendors } from 'api/services/BillService';

export const useVendors = (companyId: string) => {
  const [vendorNames, setVendorNames] = useState<{ id: any; name: string }[]>([]);

  useEffect(() => {
    getAllVendors(companyId)
      .then((vendorList) => {
        if (Array.isArray(vendorList)) {
          const names = vendorList.map((vendor) => ({
            id: vendor.id,
            name: `${vendor.firstName} ${vendor.lastName}`
          }));
          setVendorNames(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching vendors:', error);
      });
  }, [companyId]);

  return { vendorNames };
};

export const useUnits = (companyId: string) => {
  const [unitNames, setUnitNames] = useState<{ id: any; name: string }[]>([]);

  useEffect(() => {
    getAllUnits(companyId)
      .then((unitList) => {
        if (Array.isArray(unitList)) {
          const names = unitList.map((unit) => ({
            id: unit.id,
            name: `${unit.unitName}`
          }));
          setUnitNames(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching units:', error);
      });
  }, [companyId]);

  return { unitNames };
};

export const useCategories = (companyId: string) => {
  const [categories, setCategories] = useState<{ id: any; name: string }[]>([]);

  useEffect(() => {
    getAllCategories(companyId)
      .then((categoryList) => {
        if (Array.isArray(categoryList)) {
          const names = categoryList.map((category) => ({
            id: category.id,
            name: `${category.categoryName}`
          }));
          setCategories(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, [companyId]);

  return { categories };
};

export const useTaxCategories = () => {
  const [taxCategories, setTaxCategories] = useState<{ id: any; name: string; cGstRate: number; sGstRate: number; iGstRate: number }[]>([]);

  useEffect(() => {
    getAllTaxCategory()
      .then((taxCategoryList) => {
        if (Array.isArray(taxCategoryList)) {
          const names = taxCategoryList.map((taxcategory) => ({
            id: taxcategory.id,
            name: taxcategory.name,
            cGstRate: taxcategory.cGstRate,
            sGstRate: taxcategory.sGstRate,
            iGstRate: taxcategory.iGstRate
          }));
          setTaxCategories(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching tax categories:', error);
      });
  }, []);

  return { taxCategories };
};
