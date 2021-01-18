# Imports
import pandas as pd
import sys

def pick_rules(row, user_interest_list):
    consider_antecedents = True
    consider_consequents = True

    for item in row.consequents:
        if item in user_interest_list:
            consider_consequents = False
        
    if(not consider_consequents):
        return False

    # Kiya antecedents user interest k andr ha?
    for item in row.antecedents:
        if item not in user_interest_list:
            consider_antecedents = False

    if consider_antecedents and consider_consequents:
        return True
    else:
        return False

def main():
    rul_df = pd.read_csv('RecomendationFiles/Rules_dataFrame.csv', converters={'antecedents': eval, 'consequents': eval})
    users = pd.read_csv('RecomendationFiles/user_recomendation.csv', converters={'antecedents': eval, 'consequents': eval}, index_col=0)

    # user id and uinterest
    u_id = sys.argv[1]
    uinterest = sys.argv[2]
    u_i_list = uinterest.split(',')

    applied_rul_df =  pd.DataFrame(columns=rul_df.columns)

    # Check each Rule.
    for index, row in  rul_df.iterrows():
        if(pick_rules(row,u_i_list)):
            applied_rul_df = applied_rul_df.append(row)

    # get a rule which have higest lift 
    selected_rule = applied_rul_df.iloc[applied_rul_df['lift'].argmax(), :]
    selected_rule.name = u_id
    # user = pd.Series(selected_rule.to_dict(), name=u_id)
    users = users.append(selected_rule)

    users.to_csv('RecomendationFiles/user_recomendation.csv', index=True)


    
    

if __name__ == '__main__':
    main()