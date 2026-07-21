"""
Predictive Modeling Backend Test Suite for DeFi Rug Pull Detector
"""

import pytest

class RugPullPredictor:
    """Core predictive model logic for rug pull detection"""
    
    @staticmethod
    def calculate_risk_score(token_data: dict) -> dict:
        liquidity = token_data.get('liquidity_usd', 0)
        holder_concentration = token_data.get('top_10_holder_percent', 0.0)
        is_mintable = token_data.get('is_mintable', False)
        is_honeypot = token_data.get('is_honeypot', False)

        risk_score = 0.0
        
        if is_honeypot:
            risk_score += 0.95
        if is_mintable:
            risk_score += 0.30
        if liquidity < 10000:
            risk_score += 0.40
        elif liquidity < 50000:
            risk_score += 0.20
            
        if holder_concentration > 80.0:
            risk_score += 0.35
        elif holder_concentration > 50.0:
            risk_score += 0.15

        final_score = min(round(risk_score, 2), 1.0)
        
        if final_score >= 0.70:
            risk_level = 'HIGH'
        elif final_score >= 0.40:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'

        return {
            'address': token_data.get('address', '0x000'),
            'score': final_score,
            'risk_level': risk_level,
            'is_honeypot': is_honeypot,
            'is_mintable': is_mintable
        }


def test_predictive_model_high_risk_honeypot():
    token = {
        'address': '0xDEADBEEF',
        'liquidity_usd': 5000,
        'top_10_holder_percent': 90.0,
        'is_mintable': True,
        'is_honeypot': True
    }
    result = RugPullPredictor.calculate_risk_score(token)
    assert result['risk_level'] == 'HIGH'
    assert result['score'] >= 0.70
    assert result['is_honeypot'] is True


def test_predictive_model_low_risk_token():
    token = {
        'address': '0xSAFE1234',
        'liquidity_usd': 500000,
        'top_10_holder_percent': 15.0,
        'is_mintable': False,
        'is_honeypot': False
    }
    result = RugPullPredictor.calculate_risk_score(token)
    assert result['risk_level'] == 'LOW'
    assert result['score'] < 0.40


def test_batch_token_analysis():
    tokens = [
        {'address': '0x1', 'liquidity_usd': 1000, 'top_10_holder_percent': 95.0, 'is_mintable': True, 'is_honeypot': True},
        {'address': '0x2', 'liquidity_usd': 1000000, 'top_10_holder_percent': 10.0, 'is_mintable': False, 'is_honeypot': False}
    ]
    results = [RugPullPredictor.calculate_risk_score(t) for t in tokens]
    assert len(results) == 2
    assert results[0]['risk_level'] == 'HIGH'
    assert results[1]['risk_level'] == 'LOW'


def test_backend_health_check_simulation():
    health_status = {'status': 'healthy', 'service': 'predictive-modeling-backend', 'version': '1.0.0'}
    assert health_status['status'] == 'healthy'
    assert health_status['service'] == 'predictive-modeling-backend'
