import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';


const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica'
    },
    header: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    date: {
        fontSize: 10,
        textAlign: 'right',
        marginBottom: 20
    },
    childInfo: {
        fontSize: 12,
        marginBottom: 15,
        lineHeight: 1.5
    },
    categoryTitle: {
        fontSize: 14,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 5,
        fontWeight: 'bold'
    },
    questionRow: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-start'
    },
    questionNumber: {
        width: 20,
        fontSize: 12,
        marginRight: 5
    },
    questionText: {
        fontSize: 12,
        flex: 1,
        lineHeight: 1.3,
        textAlign: 'left'
    },
    answer: {
        fontSize: 12,
        width: 120,
        textAlign: 'right',
        paddingLeft: 10,
        marginLeft: 'auto'
    },
    answerCan: {
        color: '#4CAF50'
    },
    answerPartial: {
        color: '#FFA500'
    },
    answerUnknown: {
        color: '#808080'
    },
    comment: {
        fontSize: 11,
        marginLeft: 30, // Увеличиваем отступ для комментария
        marginBottom: 10,
        color: '#555',
        fontStyle: 'italic'
    }
});

const ChildReportPDF = ({ childData, categories }) => {
    const getAnswerStyle = (answer) => {
        const base = styles.answer;
        if (answer === 'Kann es') return [base, styles.answerCan];
        if (answer === 'Kann es teilweise') return [base, styles.answerPartial];
        return [base, styles.answerUnknown];
    };

    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.header}>
                    {childData?.name || 'Kind'}
                </Text>
                <Text style={styles.date}>
                    {format(new Date(), 'dd.MM.yyyy')}
                </Text>
                <View style={styles.childInfo}>
                    <Text>Geschlecht: {childData?.gender || '-'}</Text>
                    <Text>Geburtsjahr: {childData?.birthYear || '-'}</Text>
                    <Text>Gruppe: {childData?.group || '-'}</Text>
                    <Text>Altersklasse: {childData?.age || '-'}</Text>
                    <Text>Erzieher: {childData?.educator || '-'}</Text>
                </View>
                {categories?.map(category => (
                    <View key={category.id} wrap={false}>
                        <Text style={styles.categoryTitle}>
                            {category.name?.toUpperCase()}
                        </Text>
                        {category.questions?.map((q, index) => (
                            <View key={q.id}>
                                {/* Строка с вопросом и ответом */}
                                <View style={styles.questionRow}>
                                    <Text style={styles.questionNumber}>{index + 1}.</Text>
                                    <Text style={styles.questionText}>{q.text}</Text>
                                    <Text style={[
                                        styles.answer,
                                        q.answer === 'Kann es' && styles.answerCan,
                                        q.answer === 'Kann es teilweise' && styles.answerPartial,
                                        q.answer === 'Ich weiß nicht' && styles.answerUnknown
                                    ]}>
                                        {q.answer}
                                    </Text>
                                </View>

                                {/* Комментарий (если есть) */}
                                {q.comment && (
                                    <Text style={styles.comment}>Kommentar: {q.comment}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                ))}
            </Page>
        </Document>
    );
};

export default ChildReportPDF;