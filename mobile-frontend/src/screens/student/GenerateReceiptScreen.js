import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { captureRef } from 'react-native-view-shot';

import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GenerateReceiptScreen = ({ navigation, route }) => {
  const { rental } = route.params;
  const { user } = useSelector(state => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);
  const receiptRef = useRef();

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const calculateFineBreakdown = () => {
    const expectedReturn = new Date(rental.expectedReturnTime);
    const actualReturn = new Date(rental.actualReturnTime);
    const overdueMinutes = Math.floor(
      (actualReturn - expectedReturn) / (1000 * 60),
    );

    if (overdueMinutes <= 0) {
      return {
        overdueMinutes: 0,
        gracePeriod: 0,
        fineableMinutes: 0,
        ratePerMinute: 1,
        totalFine: 0,
      };
    }

    return {
      overdueMinutes,
      gracePeriod: 0,
      fineableMinutes: overdueMinutes,
      ratePerMinute: 1,
      totalFine: rental.fine,
    };
  };

  const generateReceiptNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '');
    return `GR-${dateStr}-${timeStr}-${rental._id.slice(-4).toUpperCase()}`;
  };

  const handleDownloadReceipt = async () => {
    try {
      setIsGenerating(true);

      // Capture the receipt as image
      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 1,
      });

      // Share the receipt
      await Share.share({
        url: uri,
        title: 'Green Rides Receipt',
        message: `Receipt for rental #${rental._id}`,
      });

      Alert.alert(
        'Receipt Generated!',
        'Receipt has been generated. You can now share or save it.',
      );
    } catch (error) {
      console.error('Receipt generation error:', error);
      Alert.alert('Error', 'Failed to generate receipt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareReceipt = async () => {
    try {
      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 1,
      });

      await Share.share({
        url: uri,
        title: 'Green Rides Fine Receipt',
        message: `Fine Payment Receipt - ${generateReceiptNumber()}`,
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share receipt');
    }
  };

  const fineBreakdown = calculateFineBreakdown();
  const receiptNumber = generateReceiptNumber();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt Container */}
        <View
          style={styles.receiptContainer}
          ref={receiptRef}
          collapsable={false}
        >
          {/* Header */}
          <View style={styles.receiptHeader}>
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={32} color="#4CAF50" />
              <Text style={styles.logoText}>Green Rides</Text>
            </View>
            <Text style={styles.receiptTitle}>FINE PAYMENT RECEIPT</Text>
            <Text style={styles.receiptNumber}>
              Receipt No: {receiptNumber}
            </Text>
            <Text style={styles.receiptDate}>
              Generated: {formatDate(new Date())}
            </Text>
          </View>

          {/* Student Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Student Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{user?.name || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Roll Number:</Text>
              <Text style={styles.value}>{user?.rollNo || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user?.email || 'N/A'}</Text>
            </View>
          </View>

          {/* Rental Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rental Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Cycle Number:</Text>
              <Text style={styles.value}>
                {rental.cycle?.cycleNumber || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Rental Date:</Text>
              <Text style={styles.value}>{formatDate(rental.startTime)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Expected Return:</Text>
              <Text style={styles.value}>
                {formatDate(rental.expectedReturnTime)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Actual Return:</Text>
              <Text style={styles.value}>
                {formatDate(rental.actualReturnTime)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>
                {formatDuration(rental.actualDuration || rental.duration)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>
                {rental.location?.replace('_', ' ').toUpperCase() || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Fine Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fine Calculation</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Total Overdue Time:</Text>
              <Text style={styles.value}>
                {fineBreakdown.overdueMinutes} minutes
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Grace Period:</Text>
              <Text style={styles.value}>
                {fineBreakdown.gracePeriod} minutes (Free)
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Fineable Time:</Text>
              <Text style={styles.value}>
                {fineBreakdown.fineableMinutes} minutes
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Rate per Minute:</Text>
              <Text style={styles.value}>₹{fineBreakdown.ratePerMinute}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.totalLabel}>Total Fine Amount:</Text>
              <Text style={styles.totalValue}>₹{rental.fine}</Text>
            </View>
          </View>

          {/* Payment Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Instructions</Text>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                1. Visit the Finance Office (Admin Block, Room 201){'\n'}
                2. Show this receipt to the finance officer{'\n'}
                3. Pay the fine amount in cash{'\n'}
                4. Collect your payment confirmation{'\n'}
                5. Your account will be updated within 24 hours
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.receiptFooter}>
            <Text style={styles.footerText}>
              This is a system-generated receipt for fine payment.{'\n'}
              For queries, contact: admin@greeanrides.hbtu.ac.in
            </Text>
            <View style={styles.footerDivider} />
            <Text style={styles.footerNote}>
              HBTU Green Rides Initiative - Ride Green, Live Clean
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            title="Download Receipt"
            onPress={handleDownloadReceipt}
            disabled={isGenerating}
            loading={isGenerating}
            style={styles.downloadButton}
            icon="download-outline"
          />

          <Button
            title="Share Receipt"
            onPress={handleShareReceipt}
            variant="outline"
            style={styles.shareButton}
            icon="share-outline"
          />
        </View>

        {/* Important Notice */}
        <View style={styles.noticeContainer}>
          <Ionicons name="information-circle" size={20} color="#ff6b35" />
          <Text style={styles.noticeText}>
            Important: Save this receipt! You'll need it for manual fine payment
            at the Finance Office.
          </Text>
        </View>
      </ScrollView>

      {isGenerating && (
        <LoadingSpinner overlay message="Generating receipt..." />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  receiptContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  receiptNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  receiptDate: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1.2,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1.2,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
    flex: 1,
    textAlign: 'right',
  },
  instructionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  receiptFooter: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerDivider: {
    width: 100,
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  footerNote: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionContainer: {
    padding: 15,
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 10,
  },
  shareButton: {
    borderColor: '#4CAF50',
    marginBottom: 10,
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff8f0',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    lineHeight: 18,
  },
});

export default GenerateReceiptScreen;
