port module Preferences exposing (..)

-- import Html.Styled.Attributes exposing (value)
-- import Html.Styled.Events exposing (onClick, onInput)

import Array
import Browser
import Browser.Dom as Dom
import Css exposing (backgroundColor, height, hex, margin, pct, px)
import Css.Global exposing (body, global, html)
import Debug
import Html exposing (..)
import Html.Attributes exposing (attribute, checked, class, classList, for, id, name, type_, value)
import Html.Events exposing (..)
import Html.Styled exposing (toUnstyled)
import Json.Decode as JD
import Json.Encode as JE
import Task



-- import UI
-- TODO: create just one port for IN and one port for OUT


port userSettingsSave : PreferencesModel -> Cmd msg


port checkTodoistPremiumCallback : (Bool -> msg) -> Sub msg


port checkTodoistPremium : String -> Cmd msg


port closeWindow : () -> Cmd msg


main : Program (Maybe PreferencesModel) Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Maybe PreferencesModel -> ( Model, Cmd Msg )
init maybePreferencesModel =
    ( { preferences = Maybe.withDefault emptyPreferencesModel maybePreferencesModel
      , lastSavedPreferences = Maybe.withDefault emptyPreferencesModel maybePreferencesModel
      , saving = False
      , todoistPremiumChecking = False
      , preferencesAreDifferent = False
      }
    , Cmd.none
    )



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
    checkTodoistPremiumCallback TodoistPremiumChanged



--- Model


type alias Model =
    { preferences : PreferencesModel
    , lastSavedPreferences : PreferencesModel
    , saving : Bool
    , todoistPremiumChecking : Bool
    , preferencesAreDifferent : Bool
    }


type alias TodoistStateModel =
    { isPremium : Bool
    }


type alias PreferencesModel =
    { apiKey : String
    , refreshTimeInterval : Float
    , todoistLabel : String
    , isTodoistPremium : Bool
    , timeDisplay : String
    }


emptyPreferencesModel : PreferencesModel
emptyPreferencesModel =
    { apiKey = ""
    , refreshTimeInterval = 0
    , todoistLabel = ""
    , isTodoistPremium = False
    , timeDisplay = "default"
    }



--- Update


type Msg
    = NoOp
    | OnApiKeyInputChange String
    | OnRefreshIntervalInputChange String
    | OnTodoistLabelPrefixInputChange String
    | OnTodoistLabelSuffixInputChange String
    | OnTimeDisplayChange String
    | OnPreferencesSave
    | TodoistPremiumChanged Bool
    | OnTodoistPremiumCheckClick
    | OnWindowCLoseClick
    | UpdateLastSavedPreferences PreferencesModel
    | ComparePreferencesModels


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        actualPreferences =
            model.preferences
    in
    case msg of
        OnPreferencesSave ->
            ( model, Cmd.batch [ userSettingsSave model.preferences, Task.succeed (UpdateLastSavedPreferences model.preferences) |> Task.perform identity ] )

        OnApiKeyInputChange value ->
            ( { model | preferences = updateApiKey model.preferences value }, Task.succeed OnTodoistPremiumCheckClick |> Task.perform identity )

        OnRefreshIntervalInputChange value ->
            ( { model | preferences = updateRefreshTimeInterval model.preferences value }, Task.succeed ComparePreferencesModels |> Task.perform identity )

        OnTodoistLabelPrefixInputChange value ->
            ( { model | preferences = updateTodoistLabel model.preferences value 0 }, Task.succeed ComparePreferencesModels |> Task.perform identity )

        OnTodoistLabelSuffixInputChange value ->
            ( { model | preferences = updateTodoistLabel model.preferences value 1 }, Task.succeed ComparePreferencesModels |> Task.perform identity )

        TodoistPremiumChanged isPremium ->
            ( { model | preferences = updateTodoistPremium model.preferences isPremium, todoistPremiumChecking = False }, Task.succeed ComparePreferencesModels |> Task.perform identity )

        OnTodoistPremiumCheckClick ->
            ( { model | todoistPremiumChecking = True }, checkTodoistPremium model.preferences.apiKey )

        OnWindowCLoseClick ->
            ( model, closeWindow () )

        UpdateLastSavedPreferences latestModel ->
            ( { model | lastSavedPreferences = latestModel }, Cmd.none )

        ComparePreferencesModels ->
            ( { model | preferencesAreDifferent = arePreferencesDifferent model.lastSavedPreferences model.preferences }, Cmd.none )

        OnTimeDisplayChange timeDisplay ->
            ( { model | preferences = { actualPreferences | timeDisplay = timeDisplay } }, Task.succeed ComparePreferencesModels |> Task.perform identity )

        NoOp ->
            ( model, Cmd.none )


updateTodoistPremium : PreferencesModel -> Bool -> PreferencesModel
updateTodoistPremium model value =
    { model | isTodoistPremium = value }


updateApiKey : PreferencesModel -> String -> PreferencesModel
updateApiKey model value =
    { model | apiKey = value }


updateTodoistLabel : PreferencesModel -> String -> Int -> PreferencesModel
updateTodoistLabel model value part =
    { model | todoistLabel = String.join "<minutes>" (Array.toList (Array.set part value (Array.fromList (String.split "<minutes>" model.todoistLabel)))) }


updateRefreshTimeInterval : PreferencesModel -> String -> PreferencesModel
updateRefreshTimeInterval model value =
    { model | refreshTimeInterval = Basics.clamp 0 60 (Maybe.withDefault 0 (String.toFloat value)) * 60000 }


arePreferencesDifferent : PreferencesModel -> PreferencesModel -> Bool
arePreferencesDifferent actualModel newModel =
    not (actualModel == newModel)



-- View


view : Model -> Browser.Document Msg
view model =
    { title = "Todotime • Preferences"
    , body =
        [ toUnstyled
            (global
                [ body
                    [ margin (px 0)
                    , backgroundColor (hex "f9f9f9")
                    ]
                , html [ height (pct 100) ]
                ]
            )
        , viewBody model
        ]
    }


viewBody : Model -> Html Msg
viewBody model =
    div [ class "uk-section" ]
        [ section [ class "uk-container uk-container-large" ]
            [ h1 [] [ text "Preferences" ]
            , Html.form [ class "uk-form-horizontal uk-margin-large" ]
                [ div
                    [ class "uk-margin uk-controls uk-background-default" ]
                    [ button [ class "uk-button uk-button-default uk-width-1-2", onClick OnWindowCLoseClick ] [ text "Cancel" ]
                    , button
                        [ classList
                            [ ( "uk-button-primary", model.preferencesAreDifferent == False )
                            , ( "uk-button-secondary", model.preferencesAreDifferent == True )
                            ]
                        , class "uk-button uk-width-1-2"
                        , onClick OnPreferencesSave
                        ]
                        [ text "Save Preferences" ]
                    ]
                , h2 [] [ text "Application settings" ]
                , div [ class "uk-margin" ]
                    [ label [ for "radio-time-display", class "uk-form-label" ]
                        [ text "Tray time display:" ]
                    , div
                        [ class "uk-form-controls uk-grid", id "radio-time-display" ]
                        [ label [ for "time-display-default" ]
                            [ input
                                [ id "time-display-default"
                                , class "uk-radio"
                                , name "time-display"
                                , type_ "radio"
                                , onInput OnTimeDisplayChange
                                , value "default"
                                , checked (model.preferences.timeDisplay == "default")
                                ]
                                []
                            , text " Default"
                            , span [ class "uk-text-muted" ] [ text " (2:15)" ]
                            ]
                        , label [ for "time-display-minutes" ]
                            [ input
                                [ id "time-display-minutes"
                                , class "uk-radio"
                                , name "time-display"
                                , type_ "radio"
                                , onInput OnTimeDisplayChange
                                , value "minutes1"
                                , checked (model.preferences.timeDisplay == "minutes1")
                                ]
                                []
                            , text " Minutes"
                            , span [ class "uk-text-muted" ] [ text " (135)" ]
                            ]
                        ]
                    ]
                , h2 [] [ text "Todoist" ]
                , div [ class "uk-margin" ]
                    [ label [ for "input-api-key", class "uk-form-label" ]
                        [ text "Token API:" ]
                    , div
                        [ class "uk-form-controls" ]
                        [ input [ id "input-api-key", class "uk-input uk-form-width-large", type_ "text", onInput OnApiKeyInputChange, value model.preferences.apiKey ] []
                        ]
                    ]
                , div [ class "uk-margin" ]
                    [ label [ for "btn-check-premium", class "uk-form-label" ] [ text "Premium Account check:" ]
                    , div []
                        [ viewCheckTodoisPremium model.preferences.isTodoistPremium model.todoistPremiumChecking ]
                    ]
                , div [ class "uk-margin" ]
                    [ label [ for "input-refresh-interval", class "uk-form-label" ] [ text "Refresh interval time:" ]
                    , div [ class "uk-form-controls" ]
                        [ input [ id "input-refresh-interval", class "uk-input uk-form-width-small", type_ "number", onInput OnRefreshIntervalInputChange, value (String.fromFloat (model.preferences.refreshTimeInterval / 60000)) ] []
                        , viewRefreshIntervalPostfix model.preferences.refreshTimeInterval
                        , div [ class "uk-text-muted" ] [ text "0 - manual; 60 - max;" ]
                        ]
                    ]
                , div [ class "uk-margin" ]
                    [ label [ for "input-todoist-label", class "uk-form-label" ] [ text "Task label:" ]
                    , viewTodolistLabel model.preferences.todoistLabel
                    ]
                ]
            ]
        ]


viewTodolistLabel : String -> Html Msg
viewTodolistLabel label =
    div [ class "uk-form-controls" ]
        [ input [ id "input-todoist-label", class "uk-input uk-form-width-small", type_ "text", onInput OnTodoistLabelPrefixInputChange, value (Maybe.withDefault "" (Array.get 0 (Array.fromList (String.split "<minutes>" label)))) ] []
        , text "<minutes>"
        , input [ id "input-todoist-label", class "uk-input uk-form-width-small", type_ "text", onInput OnTodoistLabelSuffixInputChange, value (Maybe.withDefault "" (Array.get 1 (Array.fromList (String.split "<minutes>" label)))) ] []
        , div [ class "uk-text-muted" ] [ text "Todoist label example: ", span [ class "uk-text-success" ] [ text "@", text (String.replace "<minutes>" "120" label) ] ]
        ]


viewRefreshIntervalPostfix : Float -> Html Msg
viewRefreshIntervalPostfix refreshTimeInterval =
    if refreshTimeInterval == 0 then
        text " Automatic refresh disabled"

    else
        text " minutes"


viewCheckTodoisPremium : Bool -> Bool -> Html Msg
viewCheckTodoisPremium isPremium isLoading =
    if isPremium == True then
        div []
            [ span
                [ classList
                    [ ( "uk-text-success", isLoading == False )
                    , ( "uk-animation-scale-down", isLoading == False )
                    ]
                , class "uk-padding-small uk-padding-remove-vertical"
                , attribute "uk-icon" "check"
                ]
                []
            , button
                [ onClick OnTodoistPremiumCheckClick
                , type_ "button"
                , Html.Attributes.disabled isLoading
                , class "uk-button uk-button-primary"
                ]
                [ text "Recheck" ]
            ]

    else
        div []
            [ span
                [ classList
                    [ ( "uk-text-danger", isLoading == False )
                    , ( "uk-animation-scale-down", isLoading == False )
                    ]
                , class "uk-padding-small uk-padding-remove-vertical"
                , attribute "uk-icon" "warning"
                ]
                []
            , button
                [ onClick OnTodoistPremiumCheckClick
                , type_ "button"
                , Html.Attributes.disabled isLoading
                , class "uk-button uk-button-danger"
                ]
                [ text "Check" ]
            ]
