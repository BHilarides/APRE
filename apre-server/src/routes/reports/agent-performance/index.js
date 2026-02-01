/**
 * Author: Professor Krasso | edited by Ben Hilarides
 * Date: 8/14/24 | 1/31/26
 * File: index.js
 * Description: Apre agent performance API for the agent performance reports\
 * update to include an endpoint to fetch agent performance data by resolution time
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /call-duration-by-date-range
 *
 * Fetches call duration data for agents within a specified date range.
 *
 * Example:
 * fetch('/call-duration-by-date-range?startDate=2023-01-01&endDate=2023-01-31')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/call-duration-by-date-range', (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return next(createError(400, 'Start date and end date are required'));
    }

    console.log('Fetching call duration report for date range:', startDate, endDate);

    mongo(async db => {
      const data = await db.collection('agentPerformance').aggregate([
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $lookup: {
            from: 'agents',
            localField: 'agentId',
            foreignField: 'agentId',
            as: 'agentDetails'
          }
        },
        {
          $unwind: '$agentDetails'
        },
        {
          $group: {
            _id: '$agentDetails.name',
            totalCallDuration: { $sum: '$callDuration' }
          }
        },
        {
          $project: {
            _id: 0,
            agent: '$_id',
            callDuration: '$totalCallDuration'
          }
        },
        {
          $group: {
            _id: null,
            agents: { $push: '$agent' },
            callDurations: { $push: '$callDuration' }
          }
        },
        {
          $project: {
            _id: 0,
            agents: 1,
            callDurations: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);
  } catch (err) {
    console.error('Error in /call-duration-by-date-range', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /call-by-resolution-time
 *
 * Fetches agent performance data grouped by average resolution time.
 * Returns agents sorted by average resolution time, fastest first.
 * 
 * Example:
 * fetch('/call-by-resolution-time')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/call-by-resolution-time', (req, res, next) => {
  try {
    console.log('Fetching call by resolution time report'); 

    mongo(async db => {
      const data = await db.collection('agentPerformance').aggregate([
        {
          $lookup: {
            from: 'agents',
            localField: 'agentId',
            foreignField: 'agentId',
            as: 'agentDetails'
          }
        },
        {
          $unwind: '$agentDetails'
        },
        {
          $group: {
            _id: '$agentDetails.name',
            avgResolutionTime: { $avg: '$resolutionTime' },
            callCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            agent: '$_id',
            avgResolutionTime: { $round: ['$avgResolutionTime', 0] },
            callCount: 1
          }
        },
        {
          $sort: { avgResolutionTime: 1 } // Sort by average resolution time ascending
        }
      ]).toArray();

      res.send(data);
    }, next);
  } catch (err) {
    console.error('Error in /call-by-resolution-time', err);
    next(err);
  }
});

module.exports = router;