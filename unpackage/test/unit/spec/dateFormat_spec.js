'use strict';
import dateFormat from 'common/dateFormat.js';
import {dateFilter} from 'filter/dateFilter.js';
/*global describe it*/
describe('dateFormat单元测试', () => {
    it('diffTime 时间差', () => {
        var d = dateFormat.diffTime(new Date());
        console.log(d);
        d = dateFormat.diffTime(1453094034000);
        console.log(d);
        d = dateFormat.diffTime('December 17, 2013 03:24:00');
        console.log(d);
        d = dateFormat.diffTime('2016 6 16 15:24:00');
        console.log(d);
    });
    it('dateFormat 格式化', () => {
        var d = dateFormat.dateFormat(new Date());
        console.log(d);
        d = dateFormat.dateFormat(1453094034000);
        console.log(d);
        d = dateFormat.dateFormat('December 17, 2016 03:24:00');
        console.log(d);
        d = dateFormat.dateFormat('2016 6 16 15:24:00');
        console.log(d);
        d = dateFormat.dateFormat(new Date(), dateFormat.ISO8601_FORMAT);
        console.log(d);
        d = dateFormat.dateFormat(new Date(), dateFormat.ISO8601_WITH_TZ_OFFSET_FORMAT);
        console.log(d);
        d = dateFormat.dateFormat(new Date(), dateFormat.ABSOLUTETIME_FORMAT);
        console.log(d);
        d = dateFormat.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        console.log(d);
    });
    
    it('dateFilter 格式化', () => {
        var d = dateFilter(new Date(),2);
        console.log('dateFilter 格式化' + d);
        d.should.be.eql('2016-07-08');
        d = dateFilter('1995-12-17T03:24:00Z',4);
        console.log(d);
        should(d).be.eql('1995-12-17 11:24:00');
        d = dateFilter('1995-12-17 03:24:00Z',2);
        console.log(d);
        d.should.be.eql('1995-12-17');
        d = dateFilter('1995-12-17T03:24:00',2);
        console.log(d);
        d.should.be.eql('1995-12-17');
    });
});
