/**
 * Author: Professor Krasso/Ben Hilarides
 * Date: 8/14/24 | 1/24/26
 * File: index.js
 * Description: Apre sales report API for the sales reports
 * Update: Added API to fetch sales data by customer
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');

const router = express.Router();

/**
 * @description
 *
 * GET /regions
 *
 * Fetches a list of distinct sales regions.
 *
 * Example:
 * fetch('/regions')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions', (req, res, next) => {
  try {
    mongo (async db => {
      const regions = await db.collection('sales').distinct('region');
      res.send(regions);
    }, next);
  } catch (err) {
    console.error('Error getting regions: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /regions/:region
 *
 * Fetches sales data for a specific region, grouped by salesperson.
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions/:region', (req, res, next) => {
  try {
    mongo (async db => {
      const salesReportByRegion = await db.collection('sales').aggregate([
        { $match: { region: req.params.region } },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount'}
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { salesperson: 1 }
        }
      ]).toArray();
      res.send(salesReportByRegion);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for region: ', err);
    next(err);
  }
});

/**
 * @description
 * 
 * GET /customers/:customerId
 *
 * Fetches sales data for a specific customer.
 *
 * Example:
 * fetch('/customers/CUST001')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/customers/:customer', (req, res, next) => {
  try {
    mongo (async db => {
      const salesReportByCustomer = await db.collection('sales').aggregate([
        { $match: { customer: req.params.customer } },
        {
          $group: {
            _id: '$customer',
            customerName: { $first: '$customer' },
            totalSales: { $sum: '$amount' },
            orderCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            customerId: '$_id',
            customerName: 1,
            totalSales: 1,
            orderCount: 1
          }
        }
      ]).toArray();
      res.send(salesReportByCustomer);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for customer: ', err);
    next(err);
  }
});

module.exports = router;